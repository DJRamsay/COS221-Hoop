--Creates the schema for the Hoop database

-- Recreate the database if it already exists
DROP DATABASE IF EXISTS COS210_HOOP;

-- Create Hoop database
CREATE DATABASE COS210_HOOP;

-- Use Hoop database
USE COS210_HOOP;

-- Create Tables and Relationships...

-- Create subscription table
CREATE TABLE IF NOT EXISTS subscription (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_type ENUM('basic', 'standard', 'premium'),
    subscription_rate DECIMAL(10, 2),
    subscription_start DATE
)

-- Create account table
CREATE TABLE IF NOT EXISTS account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT,
    fname VARCHAR(50),
    sname VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(100),
    notif_pref BOOLEAN,

    FOREIGN KEY (subscription_id) REFERENCES subscription(subscription_id)
)

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT,
    profile_age INT,
    profile_icon BLOB,

    FOREIGN KEY (account_id) REFERENCES account(account_id)
)

-- Create title table
CREATE TABLE IF NOT EXISTS title (
    title_id INT AUTO_INCREMENT PRIMARY KEY,
    title_name VARCHAR(255),
    title_type ENUM('movie', 'series'),
    release_date DATE,
    image BLOB,
    genre VARCHAR(255),
    description TEXT,
    studio VARCHAR(255),
    pg_rating VARCHAR(10),
    rating FLOAT,
    language VARCHAR(50),
    fss_address VARCHAR(255)
)

-- Create series table
CREATE TABLE IF NOT EXISTS series (
    title_id INT PRIMARY KEY,
    season_num INT,
    episode_num INT,

    FOREIGN KEY (title_id) REFERENCES title(title_id)
)

-- Create movie table
CREATE TABLE IF NOT EXISTS movie (
    title_id INT PRIMARY KEY,
    length INT,

    FOREIGN KEY (title_id) REFERENCES title(title_id)
)

-- Create credit table
CREATE TABLE IF NOT EXISTS credits (
    credit_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50), 
    sname VARCHAR(50),
    biography TEXT,
    DOB DATE
)

CREATE TABLE IF NOT EXISTS title_credits (
    title_credit_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT,
    credit_id INT,
    role VARCHAR(100),
    credit_type ENUM('cast', 'crew'),

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (credit_id) REFERENCES credits(credit_id)
)


-- Create review table
CREATE TABLE IF NOT EXISTS review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT,
    profile_id INT,
    review TEXT,
    rating INT, 
    timestamp DATETIME,

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
)

-- Create preferances table
CREATE TABLE IF NOT EXISTS preferances (
    pref_id INT AUTO_INCREMENT PRIMARY KEY,
    title_id INT,
    profile_id INT,

    FOREIGN KEY (title_id) REFERENCES title(title_id),
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
)
