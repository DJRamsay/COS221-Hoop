--Creates the schema for the Hoop database

-- Recreate the database if it already exists
DROP DATABASE IF EXISTS COS221_HOOP;

-- Create Hoop database
CREATE DATABASE COS221_HOOP;

-- Use Hoop database
USE COS221_HOOP;

-- Create Tables and Relationships...

-- Create subscription table
CREATE TABLE IF NOT EXISTS subscription (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_type ENUM('basic', 'standard', 'premium') NOT NULL,
    subscription_rate DECIMAL(10, 2) NOT NULL,
    subscription_start DATE NOT NULL,
    max_profiles INT NOT NULL
);

-- Create account table
CREATE TABLE IF NOT EXISTS account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT NOT NULL,
    fname VARCHAR(50) NOT NULL,
    sname VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    account_start DATETIME NOT NULL,
    password VARCHAR(100) NOT NULL,
    notif_pref BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (subscription_id) REFERENCES subscription(subscription_id)
);

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    profile_age INT NOT NULL,
    profile_icon BLOB,

    FOREIGN KEY (account_id) REFERENCES account(account_id)
);

-- Create title table
CREATE TABLE IF NOT EXISTS title (
    title_id INT AUTO_INCREMENT PRIMARY KEY,
    title_name VARCHAR(255) NOT NULL,
    title_type ENUM('MOVIE', 'SHOW') NOT NULL,
    release_date DATE,
    image BLOB,
    genre VARCHAR(255),
    description TEXT,
    studio VARCHAR(255),
    pg_rating VARCHAR(10),
    rating FLOAT,
    language VARCHAR(50),
    fss_address VARCHAR(255) NOT NULL DEFAULT "https://www.fss_address.com" 
);

-- Create series table
CREATE TABLE IF NOT EXISTS series (
	series_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT NOT NULL,
    season_num INT NOT NULL,
    episode_num INT NOT NULL,

    FOREIGN KEY (title_id) REFERENCES title(title_id)
);

-- Create movie table
CREATE TABLE IF NOT EXISTS movie (
	movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT NOT NULL,
    length INT NOT NULL,

    FOREIGN KEY (title_id) REFERENCES title(title_id)
);

-- Create credit table
CREATE TABLE IF NOT EXISTS credits (
    credit_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL, 
    sname VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS title_credits (
    title_credit_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT NOT NULL,
    credit_id INT NOT NULL,
    role VARCHAR(100),
    credit_type ENUM('ACTOR', 'DIRECTOR'),

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (credit_id) REFERENCES credits(credit_id)
);


-- Create review table
CREATE TABLE IF NOT EXISTS review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT NOT NULL,
    profile_id INT NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL, 
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
);

-- Create preferances table
CREATE TABLE IF NOT EXISTS preferences (
    pref_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT NOT NULL,
    profile_id INT NOT NULL,

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
);

--Trigger to ensure max_profiles is not violated
DELIMITER //

CREATE TRIGGER before_profile_insert BEFORE INSERT ON profile
FOR EACH ROW
BEGIN
    DECLARE profile_count INT;
    DECLARE max_profiles INT;

    SELECT s.max_profiles
    INTO max_profiles
    FROM subscription s
    JOIN account a ON s.subscription_id = a.subscription_id
    WHERE a.account_id = NEW.account_id;

    SELECT COUNT(*)
    INTO profile_count
    FROM profile
    WHERE account_id = NEW.account_id;

    IF profile_count >= max_profiles THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This account already has the maximum number of profiles.';
    END IF;
END//

DELIMITER ;
