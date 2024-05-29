<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');

    require_once 'config.php';

    class Database{
        private static $instance;
        private $connection;

        public $current_account_id = 1; // i added this - unathi - defaults to John Doe's id

        public static function instance() {
            static $instance = null; 
            if ($instance === null) {
                $instance = new Database();
            }
            return $instance;
        }

        private function __construct() {
            global $mysqli;
            $this->connection = $mysqli;
        }

        public static function getInstance() {
            if (!self::$instance) {
                self::$instance = new Database();
            }
            return self::$instance;
        }
    
        public function getConnection() {
            return $this->connection;
        }


        //not tested yet - will check later
        public function registerProfile($profile_details) {
            if(isset($profile_details['profile_age']) && isset($profile_details['profile_icon']))
            {
                
                $age = $profile_details['profile_age'];
                $image = $profile_details['profile_icon'];
                
              
                // Insert data into the database
                $accID = $this->current_account_id;
                $apiKey = $this->generateApiKey();
                $sql = "INSERT INTO `profile` (profile_age, profile_icon, account_id, apikey) VALUES (?, ?, ?, ?)";
                $conn = $this->getConnection();
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ibis", $age, $null, $accID, $apiKey);
                if (!$stmt->send_long_data(1, $image)) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Failed to send BLOB data."));
                    return;
                }
                
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Profile created successfully."));
                } else {
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to create a profile"));
                }
    
                // Close statement
                $stmt->close();
    
            }
            else
            {
                return $this->errorResponse("Missing Profile Details!");
            }

        }

        public function registerAccount($data) {
            $fname = $data['fname'];
            $sname = $data['sname'];
            $sub = $data['subscription'];
            $phone = $data['phone'];
            $email = $data['email'];
            $account_start = $data['account_start'];
            $password = $data['password'];
            $notif_pref = $data['notif_pref'];

            //Test for empty fields
            if ($fname == "" || $sname == "") {
                echo json_encode([
                                "error" => "400: Bad Request",
                                "message"=> "Empty fields in input data"
                                ]);
                return;
            }
            // //Test if user exists ie. email. Test email for @
            if ($this->validEmail($email)) {
                echo json_encode([
                                "error" => "400: Bad Request", 
                                "message" => "Email address already exists"
                                ]);
                return;
            }
            if (preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/', $email) == 0) {
                echo json_encode([
                                "error" => "400: Bad Request",
                                "message" => "Invalid email address"
                                ]);
                return;
            }
            // //Test password
            if (!preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/\W/', $password)) {
                echo json_encode([
                                "error" => "400: Bad Request",
                                "message" => "Password does not meet requirements"
                                ]);
                return;
            }
            //Add salt and hash

            $hash = password_hash($password, PASSWORD_ARGON2ID);

            //Add to database
            $conn = $this->getConnection();
            $sql = "insert into account (subscription_id, fname, sname, phone, email, account_start, password, notif_pref) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("isssssss", $sub, $fname, $sname, $phone, $email, $account_start, $hash, $notif_pref);
            if ($stmt->execute()) {
                $response = [
                    "status" => "success",
                    "timestamp" => time(), 
                    "data" => ["email" => $email]
                ];

                //added this - unathi
                $this->current_account_id = $this->fetchAccountID($email);
                //added this - unathi


                echo json_encode($response);
            } else {
                $response = [
                    "status" => "fail",
                    "timestamp" => time(), 
                    "data" => ["error" => $stmt->error]
                ];
                
                echo json_encode($response);
            }
        }

        public function getAllTitles($data){
            $apikey = isset($data['apikey']) ? $data['apikey'] : null;
            $return = isset($data['return']) ? $data['return'] : null;
            $limit = isset($data['limit']) ? $data['limit'] : null;
            $sort = isset($data['sort']) ? $data['sort'] : null;
            $order = isset($data['order']) ? $data['order'] : null;
            $search = isset($data['search']) ? $data['search'] : null;


            //Verify required fields
            if ($apikey === null || $return === null){
                $response = ['status' => 'fail', 'message' => 'Missing required parameters'];
                echo json_encode($response);
                return;
            }

            //check api key
            if (!$this->validAPIKey($apikey)) {
                $response = ['status' => 'fail', 'message' => 'Invalid API key'];
                echo json_encode($response);
                return;
            }
            

            //Fetch from database
            $conn = $this->getConnection();
            if (!$conn) {
                $response = ['status' => 'fail', 'message' => 'Database connection error'];
                echo json_encode($response);
                return; 
            }
            
            //Create sql statement
            if ($return == "*") {
                $sql = "SELECT * FROM listings"; //////////////
            } else {
                $sql = "SELECT " . implode(", ", $return) . " FROM listings"; //////////////
            }
            

            if ($search !== null){
                $where = [];
                $p_min = "";
                $p_max = "";
                foreach ($search as $column => $value){
                    $column = mysqli_real_escape_string($conn, $column);
            
                    if ($column === 'price_min') {
                        $p_min = mysqli_real_escape_string($conn, $value);
                    } elseif ($column === 'price_max') {
                        $p_max = mysqli_real_escape_string($conn, $value);
                    }
                    
                    if ($column === 'id' || $column === 'title' || $column === 'location' || $column === 'type') {
                        $where[] = "$column = '" . mysqli_real_escape_string($conn, $value) . "'";
                    } elseif ($column === 'bedrooms' || $column === 'bathrooms' || $column === 'parking_spaces' || $column === 'amenities') {
                        $where[] = "$column = " . mysqli_real_escape_string($conn, $value);
                    }
                }
                $sql .= " WHERE " . implode(" AND ", $where);
            
                if ($p_min != "" || $p_max != "") {
                    if ($p_min != "" && $p_max != "") {
                        $sql .= " AND price BETWEEN $p_min AND $p_max";
                    } else if ($p_min != "") {
                        $sql .= " AND price >= $p_min ";
                    } else if ($p_max != "") {
                        $sql .= " AND price <= $p_max ";
                    }
                }
            }
            
            
            if ($sort !== null) {
                $sql .= " ORDER BY $sort";
            }      

            if ($order !== null) {
                $sql .= " $order ";
            }

            if ($limit === null){
                $limit = 10;
            }
            $sql .= " LIMIT $limit";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                $response = ['status' => 'fail', 'message' => 'SQL query preparation error: ' . $conn->error];
                echo json_encode($response);
                return;
            }

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $data = $result->fetch_all(MYSQLI_ASSOC);
                $response = [
                    "status" => "success",
                    "timestamp" => time(), 
                    "data" => $data
                ];
                
                echo json_encode($response);
            } else {
                $response = [
                    "status" => "fail",
                    "timestamp" => time(), 
                    "data" => ["error" => $stmt->error]
                ];
                
                echo json_encode($response);
            }
            $stmt->close();
            $conn->close(); ///////
        }


        //error response function


    //UNATHI API FUNCTIONS
    
    //function to generate an api key
    private function generateApiKey() {
        return bin2hex(random_bytes(10));
    }

       //function to check if the user already exists in the database (by email)
       private function duplicateUserExists($email) {
        $sql = "SELECT * FROM account WHERE email = ?";
        $stmt = $this->getConnection()->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0;
    }


    //success response function
    private function successResponse($apiKey) {
       
        return json_encode([
            "status" => "success",
            "timestamp" => time(),
            "data" => [
                "apikey" => $apiKey
            ]
        ]);
    }

    //error response function
    public function errorResponse($message) {
        return json_encode([
            "status" => "error",
            "timestamp" => time(),
            "data" => $message
        ]);
    } 
    
        //login
    public function login($data) {

        // Check if the request method is POST
       // if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Get the raw POST data
           // $data = json_decode(file_get_contents("php://input"),true);
            
            // Check if all required fields are provided in the POST request
            if(isset($data['email']) && isset($data['password'])) {
            
                //get input data
                $email = $data['email'];
                $password = $data['password'];

                // Check if user exists
        if (!$this->duplicateUserExists($email)) {
            return $this->errorResponse("User does not exist in database");
        }
    
        // Fetch user data from the database
        $sql = "SELECT * FROM account WHERE email='$email'";
        $conn = $this->getConnection();
        $result = $conn->query($sql);
    
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $DBpassword = $user['password'];
    
            // Verify password
            if ($DBpassword === $password) {
                echo json_encode(array("message" => "Logged in successfully."));
                //return $this->successResponse("Logged in Successfully");
            } else {
                return $this->errorResponse("Incorrect password");
            }
        } else {
            return $this->errorResponse("User not found");
        }
            }
        //}     
            
    }

        public function fetchAPIKey($email) {
            $conn = $this->getConnection();
            $sql = "SELECT apikey FROM users WHERE email = ?";
        
            // Prepare the SQL statement
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);              
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows == 0) {
                return ['status' => 'fail', 'message' => 'Invalid Email'];
            }

            $row = $result->fetch_assoc();
            return $row['apikey'];
        }


        ///helper function to get the current user's account ID
        public function fetchAccountID($email) {
            $conn = $this->getConnection();
            $sql = "SELECT account_id FROM account WHERE email = ?";
        
            // Prepare the SQL statement
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $email);              
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows == 0) {
                return ['status' => 'fail', 'message' => 'Invalid Email'];
            }

            $row = $result->fetch_assoc();
            return $row['account_id']; //getting the account_id of the user currently
        }


        public function fetchStored($email) {
            $conn = $this->getConnection();
            $sql = "SELECT password FROM users WHERE email = ?";
        

            $stmt = $conn->prepare($sql);        
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows == 0) {
                return ['status' => 'fail', 'message' => 'Invalid Email'];
            }

            $row = $result->fetch_assoc();
            return $row['password'];
        }

        public function validEmail($email){
            $conn = $this->getConnection();
            $sql = "SELECT * FROM account WHERE email = ?";
        
            // Prepare the SQL statement
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                echo "Error preparing SQL statement: " . $conn->error;
                return false; 
            }
        
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
        
            // Check if any rows were returned
            return $result->num_rows > 0;
        }
        

        public function validAPIKey($key){
            $conn = $this->getConnection();
            if (!$conn) {
                throw new Exception("Database connection error: " . $conn->error);
            }
        
            $sql = "SELECT * FROM profile WHERE apikey = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Error preparing SQL statement: " . $conn->error);
            }
        
            $stmt->bind_param("s", $key);
            // Execute SQL query
            if (!$stmt->execute()) {
                $errorMessage = $stmt->error;
                throw new Exception("Error executing SQL query: " . $errorMessage);
            }
    
            $result = $stmt->get_result();
            $isValid = $result->num_rows > 0;
        
            return $isValid;
        }

            //function to get all the movies
            public function GetMovies()
            {
                $conn = $this->getConnection();
                $sql = "SELECT * FROM title WHERE title_type = ?";
                $stmt = $conn->prepare($sql);
                $type = "MOVIE";
                $stmt->bind_param("s", $type);
                
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        $movies = [];
                        while ($row = $result->fetch_assoc()) {
                            $movies[] = $row;
                        }
                        http_response_code(200);
                        echo json_encode(["status" => "success", "data" => $movies]);
                    } else {
                        http_response_code(404);
                        echo json_encode(["status" => "fail", "message" => "No movies found"]);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => $stmt->error]);
                }
                $stmt->close();
            }
            
            //function to get all the series
            public function GetSeries()
            {
                $conn = $this->getConnection();
                $sql = "SELECT * FROM title WHERE title_type = ?";
                $stmt = $conn->prepare($sql);
                $type = "SHOW";
                $stmt->bind_param("s", $type);
                
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        $series = [];
                        while ($row = $result->fetch_assoc()) {
                            $series[] = $row;
                        }
                        http_response_code(200);
                        echo json_encode(["status" => "success", "data" => $series]);
                    } else {
                        http_response_code(404);
                        echo json_encode(["status" => "fail", "message" => "No series found"]);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => $stmt->error]);
                }
                $stmt->close();
            }
        
        public function GetProfiles($accountId)
            {
                $conn = $this->getConnection();
                $sql = "SELECT * FROM profile WHERE account_id = ?";
                $stmt = $conn->prepare($sql); 
                $stmt->bind_param("i", $accountId);
            
                if ($stmt->execute()) {

                    $result = $stmt->get_result();
            
                    if ($result->num_rows > 0) {
                        $profiles = [];
                        while ($row = $result->fetch_assoc()) {
                            $profiles[] = $row;
                        }
                        http_response_code(200);
                        echo json_encode(["status" => "success", "data" => $profiles]);
                    } else {
                        // No profiles found, return 404 response
                        http_response_code(404);
                        echo json_encode(["status" => "fail", "message" => "No profiles found"]);
                    }
                } else {
                    // Error executing the statement, return 500 response
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => $stmt->error]);
                }
                $stmt->close();
            }

            //function for the administrator to add a new Title to the database
            public function AddTitle($data)
            {
                if(isset($data['title_name']) && isset($data['title_type']) && isset($data['release_date']) && isset($data['genre']) && isset($data['image'])
                    && isset($data['description']) && isset($data['pg_rating']) && isset($data['rating']) && isset($data['language']) && isset($data['studio']) && isset($data['fss_address']))
                {
                    $title_name = $data['title_name'];
                    $title_type = $data['title_type'];
                    $release_date = $data['release_date'];
                    $genre = $data['genre'];
                    $image = $data['image'];
                    $description = $data['description'];
                    $pg_rating = $data['pg_rating'];
                    $rating = $data['rating'];
                    $language = $data['language'];
                    $studio = $data['studio'];
                    $fss_address = $data['fss_address'];

                    // Validate release_date
                    if (!DateTime::createFromFormat('Y-m-d', $release_date)) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Invalid date format. Please use YYYY-MM-DD."));
                        return;
                    }

                    // Insert data into the database
                    $conn = $this->getConnection();
                    $sql = "INSERT INTO title (title_name, title_type, release_date, genre, `image`, `description`, pg_rating, rating, `language`, studio, fss_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt = $conn->prepare($sql);

                    $stmt->bind_param("ssssbssssds", $title_name, $title_type, $release_date, $genre, $image, $description, $pg_rating, $rating, $language, $studio, $fss_address);

                    if (!$stmt->execute()) {
                        error_log("Error executing query: " . $stmt->error);
                        http_response_code(500);
                        echo json_encode(array("message" => "Unable to add Title to database."));
                        $stmt->close();
                        return;
                    }                

                    http_response_code(201);
                    echo json_encode(array("message" => "Title successfully added to database"));

                    // Close statement
                    $stmt->close();
                }
                else
                {
                    echo $this->errorResponse("Missing Title Details!");
                }
            }
        
        //function to delete a a user and their associated profiles from the database
        public function DeleteUserAndProfiles($data)
        {
            if(isset($data['account_id']))
            {
                $account_id = $data['account_id'];

                $conn = $this->getConnection();
                //delete associated profiles from the database
                $sql = "DELETE FROM `profile` WHERE account_id LIKE $account_id";
                $stmt = $conn->prepare($sql);

                if (!$stmt->execute()) {
                    error_log("Error executing query: " . $stmt->error);
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable to delete profiles from database."));
                    $stmt->close();
                    return;
                }                

                http_response_code(201);
                echo json_encode(array("message" => "Profiles successfully deleted from database"));

                // Close statement
                $stmt->close();

                //delete account from the database
                $sql = "DELETE FROM account WHERE account_id LIKE $account_id";
                $stmt = $conn->prepare($sql);

                if (!$stmt->execute()) {
                    error_log("Error executing query: " . $stmt->error);
                    http_response_code(500);
                    echo json_encode(array("message" => "Unable delete account from database."));
                    $stmt->close();
                    return;
                }                

                http_response_code(201);
                echo json_encode(array("message" => "account successfully deleted from database"));

                // Close statement
                $stmt->close();



            }
            else
            {
                echo $this->errorResponse("Missing account id");
            }
        }

        //function to Update a title
        public function updateTitle($data) {
            if (!isset($data['title_id'])) {
                http_response_code(400);
                echo json_encode(array("message" => "Title ID is required for update."));
                return;
            }
        
            $title_id = $data['title_id'];
            $conn = $this->getConnection();
        
            $fields = [];
            $params = [];
            $types = '';
        
            if (isset($data['title_name'])) {
                $fields[] = "title_name = ?";
                $params[] = $data['title_name'];
                $types .= 's';
            }
            if (isset($data['title_type'])) {
                $fields[] = "title_type = ?";
                $params[] = $data['title_type'];
                $types .= 's';
            }
            if (isset($data['release_date'])) {
                // Validate release_date
                if (!DateTime::createFromFormat('Y-m-d', $data['release_date'])) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Invalid date format. Please use YYYY-MM-DD."));
                    return;
                }
                $fields[] = "release_date = ?";
                $params[] = $data['release_date'];
                $types .= 's';
            }
            if (isset($data['genre'])) {
                $fields[] = "genre = ?";
                $params[] = $data['genre'];
                $types .= 's';
            }
            if (isset($data['image'])) {
                $fields[] = "image = ?";
                $params[] = $data['image'];
                $types .= 'b';
            }
            if (isset($data['description'])) {
                $fields[] = "description = ?";
                $params[] = $data['description'];
                $types .= 's';
            }
            if (isset($data['pg_rating'])) {
                $fields[] = "pg_rating = ?";
                $params[] = $data['pg_rating'];
                $types .= 's';
            }
            if (isset($data['rating'])) {
                $fields[] = "rating = ?";
                $params[] = $data['rating'];
                $types .= 'd';
            }
            if (isset($data['language'])) {
                $fields[] = "language = ?";
                $params[] = $data['language'];
                $types .= 's';
            }
            if (isset($data['studio'])) {
                $fields[] = "studio = ?";
                $params[] = $data['studio'];
                $types .= 's';
            }
            if (isset($data['fss_address'])) {
                $fields[] = "fss_address = ?";
                $params[] = $data['fss_address'];
                $types .= 's';
            }
        
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(array("message" => "No valid fields to update."));
                return;
            }
        
            $sql = "UPDATE title SET " . implode(', ', $fields) . " WHERE title_id = ?";
            $params[] = $title_id;
            $types .= 'i';
        
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Unable to prepare statement."));
                return;
            }
        
            $stmt->bind_param($types, ...$params);
        
            if (!$stmt->execute()) {
                error_log("Error executing query: " . $stmt->error);
                http_response_code(500);
                echo json_encode(array("message" => "Unable to update Title in database."));
                $stmt->close();
                return;
            }
        
            if ($stmt->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(array("message" => "Title successfully updated"));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Title not found or no change detected."));
            }
        
            // Close statement
            $stmt->close();
        }
        

    }


    $json = file_get_contents('php://input');
    if ($json === false || $json === null) {
        echo json_encode(["error" => "400: Bad Request", "message" => "Unable to read JSON data from request"]);
        exit();
    }

    $data = json_decode($json, true);
    if ($data === null) {
        echo json_encode(["error" => "400: Bad Request", "message" => "Invalid JSON data"]);
        exit();
    }

    if (!isset($data['type'])) {
        echo json_encode(["error" => "400: Bad Request", "message" => "'type' key is missing in JSON data"]);
        exit();
    }

    $instance = Database::instance();
    $type = $data['type'];
    if ($type == "Register Account") {
        $instance->registerAccount($data);        
    } else if ($type == "Register Profile"){
       $instance->registerProfile($data);
    } else if ($type == "GetAllTitles") {
        $instance->getAllTitles($data);        
    } else if ($type == "Login") {
       echo $instance->login($data);
    }
    else if ($type == "GetMovies") {
        echo $instance->GetMovies();
    }
    else if ($type == "GetSeries") {
        echo $instance->GetSeries();
    }
    else if ($type == "AddTitle") {
        echo $instance->AddTitle($data);
    }
    else if ($type == "UpdateTitle") {
        echo $instance->updateTitle($data);
    }
    else if ($type == "DeleteUserAndProfiles")
    {
        echo $instance->DeleteUserAndProfiles($data);
    }
    //$instance->getAgents();

?>
