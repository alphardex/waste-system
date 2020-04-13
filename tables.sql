CREATE TABLE `disposal` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `weight` double NOT NULL
);

CREATE TABLE `vehicles` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `platenumber` varchar(255) NOT NULL,
  `buytime` date,
  `cost` int,
  `typenumber` varchar(255),
  `capacity` double,
  `mileage` double
);

CREATE TABLE `drivers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `gender` varchar(255),
  `birthdate` date,
  `phone` varchar(255),
  `worktime` date,
  `license` varchar(255),
  `violation` int,
  `platenumber` varchar(255)
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255),
  `phone` varchar(255)
);
