<?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');

    require_once 'config.php';

    class Database{
        private static $instance;
        private $connection;

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

        public function registerProfile($data) {
            $name = $data['name'];

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

    

        public function login($data) {
            session_start();
            $email = isset($data['email']) ? $data['email'] : null;
            $password = isset($data['password']) ? $data['password'] : null;

            if ($email === null || $password === null){
                $response = ['status' => 'fail', 'message' => 'Missing required parameters'];
                echo json_encode($response);
                return;
            }

            $stored = $this->fetchStored($email);

            if (!$storedPassword) {
                return ['status' => 'fail', 'message' => 'Invalid email'];
            }

            if (password_verify($password, $stored)) {
                $key = $this->fetchAPIKey($email);
                $response = [
                    "status" => "success",
                    "timestamp" => time(), 
                    "data" => ["apikey" => $api_key]
                ];
                
                echo json_encode($response);
            } else {
                return ['status' => 'fail', 'message' => 'Invalid password'];
            }
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
    } else if ($type = "Register Profile"){
        $instance->registerProfile($data);
    } else if ($type == "GetAllTitles") {
        $instance->getAllTitles($data);        
    } else if ($type == "Login") {
        $instance->login($data);
    }
    //$instance->getAgents();

?>
