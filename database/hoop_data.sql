INSERT INTO subscription (subscription_type,subscription_rate, max_devices) VALUES 
('basic', 100.00, 1),
('standard', 200.00, 3),
('premium', 300.00, 5);

INSERT INTO account (subscription_id, fname, sname, phone, email, account_start, password, notif_pref) VALUES
();

INSERT INTO profile (account_id, profile_age, profile_icon) VALUES
();

INSERT INTO title (title_name, title_type, release_date, image, genre, description, studio, pg_rating, rating, language, fss_address) VALUES
();

INSERT INTO series(title_id, season_num, episode_num) VALUES
();

INSERT INTO movie (title_id, length) VALUES
();

INSERT INTO credits (fname, sname, biography, DOB) VALUES
();

INSERT INTO title_credits (title_id, credit_id, role, credit_type) VALUES
();

INSERT INTO review (title_id, profile_id, review, rating, timestamp) VALUES
();

INSERT INTO preferances (title_id, profile_id) VALUES
();