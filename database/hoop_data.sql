INSERT INTO subscription (subscription_type, subscription_rate, subscription_start) VALUES
    -> ('basic', 250.00, '2023-01-01'),
    -> ('standard', 350.00, '2023-02-01'),
    -> ('premium', 450.00, '2023-03-01'),
    -> ('basic', 250.00, '2023-04-01'),
    -> ('standard', 350.00, '2023-05-01'),
    -> ('premium', 450.00, '2023-06-01'),
    -> ('basic', 250.00, '2023-07-01'),
    -> ('standard', 350.00, '2023-08-01'),
    -> ('premium', 450.00, '2023-09-01'),
    -> ('basic', 250.00, '2023-10-01');

INSERT INTO account (subscription_id, fname, sname, phone, email, password, notif_pref) VALUES
    -> (1, 'John', 'Doe', '0823456789', 'john.doe@example.com', 'Password123!', TRUE),
    -> (2, 'Jane', 'Smith', '0834567890', 'jane.smith@example.com', 'Password456!', FALSE),
    -> (3, 'Alice', 'Johnson', '0845678901', 'alice.johnson@example.com', 'Password789!', TRUE),
    -> (4, 'Robert', 'Brown', '0856789012', 'robert.brown@example.com', 'Password012!', FALSE),
    -> (5, 'Emily', 'Davis', '0867890123', 'emily.davis@example.com', 'Password345!', TRUE),
    -> (6, 'Michael', 'Wilson', '0878901234', 'michael.wilson@example.com', 'Password678!', FALSE),
    -> (7, 'Emma', 'Moore', '0889012345', 'emma.moore@example.com', 'Password901!', TRUE),
    -> (8, 'Daniel', 'Taylor', '0890123456', 'daniel.taylor@example.com', 'Password234!', FALSE),
    -> (9, 'Sophia', 'Anderson', '0801234567', 'sophia.anderson@example.com', 'Password567!', TRUE),
    -> (10, 'James', 'Thomas', '0812345678', 'james.thomas@example.com', 'Password890!', FALSE);

INSERT INTO profile(account_id, profile_age, profile_icon) VALUES
    -> (1, 18, NULL),
    -> (2, 35, NULL),
    -> (2, 34, NULL),
    -> (2, 8, NULL),
    -> (3, 45, NULL),
    -> (3, 47, NULL),
    -> (3, 12, NULL),
    -> (3, 20, NULL),
    -> (4, 21, NULL),
    -> (5, 37, NULL),
    -> (5, 37, NULL),
    -> (5, 38, NULL),
    -> (6, 71, NULL),
    -> (6, 50, NULL),
    -> (6, 45, NULL),
    -> (6, 43, NULL),
    -> (6, 31, NULL),
    -> (7, 30, NULL),
    -> (8, 21, NULL),
    -> (8, 20, NULL),
    -> (8, 16, NULL),
    -> (9, 30, NULL),
    -> (9, 32, NULL),
    -> (9, 29, NULL),
    -> (10, 40, NULL);

INSERT INTO title (title_name, title_type, release_date, image, genre, description, studio, pg_rating, rating, language, fss_address) VALUES
('Five Came Back: The Reference Films', 'SHOW', '1945-01-01', NULL, '[documentation]', 'This collection includes 12 World War II-era propaganda films — many of which are graphic and offensive — discussed in the docuseries "Five Came Back."', NULL, 'TV-MA', NULL, NULL, 'https://www.fss_address.com'),
('Rocky', 'MOVIE', '1976-01-01', NULL, '[drama, sport]', 'When world heavyweight boxing champion, Apollo Creed wants to give an unknown fighter a shot at the title as a publicity stunt, his handlers choose palooka Rocky Balboa, an uneducated collector for a Philadelphia loan shark. Rocky teams up with trainer  Mickey Goldmill to make the most of this once in a lifetime break.', NULL, 'PG', 8.1, NULL, 'https://www.fss_address.com'),
('Grease', 'MOVIE', '1978-01-01', NULL, '[romance, comedy]', 'Australian good girl Sandy and greaser Danny fell in love over the summer. But when they unexpectedly discover theyre now in the same high school, will they be able to rekindle their romance despite their eccentric friends?', NULL, 'PG', 7.2, NULL, 'https://www.fss_address.com'),
('The Sting', 'MOVIE', '1973-01-01', NULL, '[crime, drama, comedy, music]', 'A novice con man teams up with an acknowledged master to avenge the murder of a mutual friend by pulling off the ultimate big con and swindling a fortune from a big-time mobster.', NULL, 'PG', 8.3, NULL, 'https://www.fss_address.com'),
('Rocky II', 'MOVIE', '1979-01-01', NULL, '[drama, sport]', 'After Rocky goes the distance with champ Apollo Creed, both try to put the fight behind them and move on. Rocky settles down with Adrian but cant put his life together outside the ring, while Creed seeks a rematch to restore his reputation. Soon enough, the "Master of Disaster" and the "Italian Stallion" are set on a collision course for a climactic battle that is brutal and unforgettable.', NULL, 'PG', 7.3, NULL, 'https://www.fss_address.com'),
('Monty Python and the Holy Grail', 'MOVIE', '1975-01-01', NULL, '[fantasy, comedy]', 'King Arthur, accompanied by his squire, recruits his Knights of the Round Table, including Sir Bedevere the Wise, Sir Lancelot the Brave, Sir Robin the Not-Quite-So-Brave-As-Sir-Lancelot and Sir Galahad the Pure. On the way, Arthur battles the Black Knight who, despite having had all his limbs chopped off, insists he can still fight. They reach Camelot, but Arthur decides not  to enter, as "it is a silly place".', NULL, 'PG', 8.2, NULL, 'https://www.fss_address.com'),
('Animal House', 'MOVIE', '1978-01-01', NULL, '[comedy]', 'At a 1962 College, Dean Vernon Wormer is determined to expel the entire Delta Tau Chi Fraternity, but those troublemakers have other plans for him.', NULL, 'R', 7.4, NULL, 'https://www.fss_address.com'),
('Monty Pythons Flying Circus', 'SHOW', '1969-01-01', NULL, '[comedy, european]', 'A British sketch comedy series with the shows being composed of surreality, risqué or innuendo-laden humour, sight gags and observational sketches without punchlines.', NULL, 'TV-14', 8.8, NULL, 'https://www.fss_address.com'),
('Life of Brian', 'MOVIE', '1979-01-01', NULL, '[comedy]', 'Brian Cohen is an average young Jewish man, but through a series of ridiculous events, he gains a reputation as the Messiah. When hes not dodging his followers or being scolded by his shrill mother, the hapless Brian has to contend with the pompous Pontius Pilate and acronym-obsessed members of a separatist movement. Rife with Monty Pythons signature absurdity, the tale finds Brians life paralleling Biblical lore, albeit with many more laughs.', NULL, 'R', 8.0, NULL, 'https://www.fss_address.com'),
('White Christmas', 'MOVIE', '1954-01-01', NULL, '[comedy, music, romance]', 'Two talented song-and-dance men team up after the war to become one of the hottest acts in show business. In time they befriend and become romantically involved with the beautiful Haynes sisters who comprise a sister act.', NULL, 'NULL', 7.5, NULL, 'https://www.fss_address.com'),
('Heroes', 'MOVIE', '1977-01-01', NULL, '[drama, comedy, romance]', 'A Vietnam veteran suffering from post traumatic stress disorder breaks out of a VA hospital and goes on a road trip with a sympathetic traveler to find out what became of the other men in his unit.', NULL, 'PG', 6.0, NULL, 'https://www.fss_address.com'),
('Play Misty for Me', 'MOVIE', '1971-01-01', NULL, '[drama, thriller]', 'A brief fling between a male disc jockey and an obsessed female fan takes a frightening, and perhaps even deadly turn when another woman enters the picture.', NULL, 'R', 6.9, NULL, 'https://www.fss_address.com'),
('Cairo Station', 'MOVIE', '1958-01-01', NULL, '[drama, comedy, crime]', 'Qinawi, a physically challenged peddler who makes his living selling newspapers in the central Cairo train station, is obsessed by Hanuma, an attractive young woman who sells drinks. While she jokes with him about a possible relationship, she is actually in love with Abu Siri, a strong and respected porter at the station who is struggling to unionize his fellow workers to combat their boss exploitative and abusive treatment.', NULL, 'NULL', 7.5, NULL, 'https://www.fss_address.com'),
('Richard Pryor: Live in Concert', 'MOVIE', '1979-01-01', NULL, '[comedy, documentation]', 'Richard Pryor delivers monologues on race, sex, family and his favorite target—himself, live at the Terrace Theatre in Long Beach, California.', NULL, 'R', 8.1, NULL, 'https://www.fss_address.com'),
('Bandie', 'MOVIE', '1978-01-01', NULL, '[drama, romance, action]', 'Maharaj Brajbhan lives a wealthy lifestyle in Bharatpur, India along with his wife, Badi Rani, but have been unable to conceive for Bharatpur, and have no choice but to leave its reigns with Brajbans widowed cousin, Vikram, and his son, Kanchan. When Vikram finds out that Badi Rani is pregnant, he plots to first sully her character by having her abducted, then shunned by the Maharaj, and then decides to have her killed. But her killer has a change of heart and lets her live. She gives birth to a son, names him Bhola, and starts living a simple lifestyle in a Mandir with the help of its Poojary. Years later Vikram finds out she is alive and kills her, as well the Poojary and the Poojarys son. Bhola witnesses this, manages to escape, starts to live with a poor widow, grows up uneducated, and makes a living through crime.', NULL, 'NULL', 4.8, NULL, 'https://www.fss_address.com'),
('Prince', 'MOVIE', '1969-01-01', NULL, '[romance]', 'To better himself, a spoiled prince temporarily assumes a commoners identity. But he soon learns his palace has been gifted to his fathers new wife.', NULL, 'NULL', 6.8, NULL, 'https://www.fss_address.com'),
('FTA', 'MOVIE', '1972-01-01', NULL, '[comedy, documentation, music]', 'A documentary about a political troupe headed by actors Jane Fonda and Donald Sutherland which traveled to towns near military bases in the US in the early 1970s. The group put on shows called "F.T.A.", which stood for "F**k the Army", and was aimed at convincing soldiers to voice their opposition to the Vietnam War, which was raging at the time. Various singers, actors and other entertainers performed antiwar songs and skits during the show.', NULL, 'R', 6.4, NULL, 'https://www.fss_address.com'),
('Monty Pythons Fliegender Zirkus', 'SHOW', '1972-01-01', NULL, '[comedy]', 'Monty Pythons Fliegender Zirkus consisted of two 45-minute Monty Python German television comedy specials produced by WDR for West German television. The two episodes were first broadcast in January and December 1972 and were shot entirely on film and mostly on location in Bavaria, with the first episode recorded in German and the second recorded in English and then dubbed into German.', NULL, 'TV-MA', 8.1, NULL, 'https://www.fss_address.com'),
('Hitler: A Career', 'MOVIE', '1977-01-01', NULL, '[documentation, history, european]', 'A keen chronicle of the unlikely rise to power of Adolf Hitler (1889-1945) and a dissection of the Third Reich (1933-1945), but also an analysis of mass psychology and how the desperate crowd can be deceived and shepherded to the slaughterhouse.', NULL, 'PG', 7.5, NULL, 'https://www.fss_address.com'),
('Amrapali', 'MOVIE', '1966-01-01', NULL, '[fantasy]', 'After a failed conquest, Emperor Ajaatshatru pretends to be a soldier in the enemys army to weaken them from the inside. However, he falls in love with Amrapali by faking his identity.', NULL, 'NULL', 6.7, NULL, 'https://www.fss_address.com');

INSERT INTO series (title_id, season_num, episode_num) VALUES
(1,1,1),
(1,1,2),
(1,1,3),
(1,1,4),
(1,1,5),
(8,1,1),
(8,1,2),
(8,1,3),
(8,1,4),
(8,1,5),
(8,2,1),
(8,2,2),
(8,2,3),
(8,2,4),
(8,2,5),
(18,1,1),
(18,1,2),
(18,1,3),
(18,1,4),
(18,1,5),
(18,2,1),
(18,2,2),
(18,2,3),
(18,2,4),
(18,2,5);

INSERT INTO movie (title_id, length) VALUES
(2,180),
(3,210),
(4,160),
(5,175),
(6,192),
(7,95),
(9,65),
(10,100),
(11,112),
(12,86),
(13,92),
(14,125),
(15,115),
(16,165),
(17,125),
(19,110),
(20,300);

     INSERT INTO preferances (title_id, profile_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 6),
(2, 7),
(3, 8),
(4, 9),
(5, 10),
(6, 11),
(7, 12),
(8, 13),
(9, 14),
(10,15),
(6, 16),
(7, 17),
(8, 18),
(9, 19),
(10, 20);
