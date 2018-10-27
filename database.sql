-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 27, 2018 at 08:30 AM
-- Server version: 5.7.23
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `grabbd`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmark`
--

CREATE TABLE `bookmark` (
  `id` int(11) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `tmdb_ID` varchar(255) NOT NULL,
  `imdb_ID` varchar(255) NOT NULL,
  `movie_name` text NOT NULL,
  `liked` int(1) NOT NULL DEFAULT '0',
  `added_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookmark`
--

INSERT INTO `bookmark` (`id`, `user_ID`, `tmdb_ID`, `imdb_ID`, `movie_name`, `liked`, `added_at`) VALUES
(3, 20, '260513', 'tt3606756', 'Incredibles 2', 1, '2018-10-27 13:38:51'),
(4, 20, '343668', 'tt4649466', 'Kingsman: The Golden Circle', 1, '2018-10-27 13:39:45'),
(5, 20, '299536', 'tt4154756', 'Avengers: Infinity War', 0, '2018-10-27 13:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `follow`
--

CREATE TABLE `follow` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followee_id` int(11) NOT NULL,
  `follow_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unfollow_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `follow`
--

INSERT INTO `follow` (`id`, `follower_id`, `followee_id`, `follow_date`, `unfollow_date`) VALUES
(1, 20, 21, '2018-10-26 18:29:30', NULL),
(2, 20, 28, '2018-10-26 20:10:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `added_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_ID`, `name`, `email`, `password`, `image`, `added_at`, `updated_at`) VALUES
(19, 'mithun', 'mithun@gmail.com', '$2b$10$OzMCqOiPnmeKe65ahnRlZuLF/RBgnwH6FNuimfGBH99Gmmal.6o6a', 'uploads/e2b9219ac9ee466d4b725061d3deadc8', '2018-10-26 16:08:28', '2018-10-26 20:51:46'),
(20, 'amit', 'amit@gmail.com', '$2b$10$MDNYGqoUeDzUATSb0Pxxne0N0Tu2YaSVPeqxjC2v/kF6Vb6ngvJ2e', 'uploads/925718ca242259cc69ddfede4e48a474', '2018-10-26 16:09:03', '2018-10-26 20:51:41'),
(21, 'christo', 'christo@gmail.com', '$2b$10$fT5R9sqeWN/CUxeuTp6HsullkGPIep/WaACKI4aNMVWZh92uvaeX.', 'uploads/467bdd0da866073484eeddf23e196468', '2018-10-26 16:10:40', '2018-10-26 20:51:51'),
(28, 'gautham', 'Gautham@gmail.com', '$2b$10$Ex.Xbh7CLUIbfNmORaFEW.kX.FXX2UqPawh.dZmmWofHCOziPr2GK', 'uploads/e59ecc5f6e24f153f4b606820bf8cc88', '2018-10-26 16:34:18', '2018-10-26 20:51:56'),
(29, 'amit', 'amit.kumar@gmail.com', '$2b$10$u.ISkJPIlzXuqwN2YOyDl.PET3SSkxRS4kD/6QxRXQeMT8XMV0ya6', 'uploads/962593d642da66b07021e6359319dabc', '2018-10-26 21:03:58', '2018-10-26 21:03:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_ID` (`user_ID`);

--
-- Indexes for table `follow`
--
ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `follower_id` (`follower_id`),
  ADD KEY `followee_id` (`followee_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmark`
--
ALTER TABLE `bookmark`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `follow`
--
ALTER TABLE `follow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookmark`
--
ALTER TABLE `bookmark`
  ADD CONSTRAINT `bookmark_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`);

--
-- Constraints for table `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`followee_id`) REFERENCES `user` (`user_ID`),
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_ID`);
