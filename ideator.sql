-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2020 at 01:00 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ideator`
--

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` varchar(64) NOT NULL,
  `name` text NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `rate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='feedback about the app';

-- --------------------------------------------------------

--
-- Stand-in structure for view `idealist`
-- (See below for the actual view)
--
CREATE TABLE `idealist` (
`id` varchar(64)
,`pid` varchar(64)
,`creatorId` varchar(64)
,`creatorName` varchar(100)
,`title` text
,`description` text
,`date` datetime
);

-- --------------------------------------------------------

--
-- Table structure for table `ideas`
--

CREATE TABLE `ideas` (
  `id` varchar(64) NOT NULL,
  `creatorId` varchar(64) NOT NULL,
  `projectId` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='stores data related to ideas';

-- --------------------------------------------------------

--
-- Stand-in structure for view `messagelist`
-- (See below for the actual view)
--
CREATE TABLE `messagelist` (
`id` varchar(64)
,`uid` varchar(64)
,`sender` varchar(100)
,`date` datetime
,`content` text
,`wid` varchar(64)
);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(64) NOT NULL,
  `creatorId` varchar(64) NOT NULL,
  `workspaceId` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='stores data related to messages';

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `creatorId`, `workspaceId`, `content`, `date`) VALUES
('OUTpvSQJEHaPyBTPFPZxKI1rdOD5tsqf', 'maBswfIfBRPlG5Lxjl2ut97QoEJ2', '6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', '{\"iv\":\"KkGDdKcWFjzsUTjLusUmDA==\",\"v\":1,\"iter\":10000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"UmaGRUnFajQ=\",\"ct\":\"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\"}', '2020-03-22 22:47:15'),
('p9VYlQvcWbJ8InWmj41nIQj8yaLMGQcP', 'ES9SIINQYQeYpCuSGkLOVXokRVd2', '6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', '{\"iv\":\"4I3YyMXSXboWKfJzyvMQNw==\",\"v\":1,\"iter\":10000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"ZM43TyER8J4=\",\"ct\":\"Cfvxv/Ao1JUhL+JmRekE4SNYTq87uDL6ei74hbBqGeaF3C86P/0d61n6ynQ+mds0GuspKX2+pPRr8EkV9pTr5zoLxBSvnUO1an28K2g3VBT7KRwnuPBE4zBKkb+f4CAmjHxrljFF/kSm25sHSWsfwK8B7+Ti5CcVqJY3MiVtg7iyBh0yJYQLUBho3kI7xL8nY2TvmJGIU2lh2VX9btWS8+KHzgI7rKXTC/c4HMq65+yIWeC3e7VKfVS+/UYGlle0VOQSIjzNIzYkmqbQr0MSeUShj0zsrumVFwPU1UaTSy2wt9O7vwchskahPtA2WaosMuGxv/yKPsIa24kRb9h0X/VlOSUz/Yi7aml+RdhDN1O10p7Wq7r8htRVYriIJlJ3IU7hjr4W+XAwG9DOmjUszT0tscxh5i/rBeRPgLOU5u9OHywjAggf8qbs71ASgn8F0A5MHBZs+jg+/frSjOF/EyyXSeXcO28r1xmFri1P2wwE/u7qYIakU52ZuV70Quj7kZ/2Fn5qFcC4McW0hZqcpKkrSeLAtyUChXem+NVXUcfUWEk5+WGfsQ88NNK6Fz84TWFUQZCIjDtsigX4DC79i1SFqSOThZ89JTiUufRK8CIwzsLieCwAzXN0mbiqxa0+ANRHBH2uNqdIxJcVMB0g/bi2HEMIU2NXV6Gbn0n7Ex2nyqeZv3TNKL/zLqKgwxvTc6UXi0QRIvW8rmClfQJqbiTYdVFOFqD4e05quyaptCQW+W8kR9WzWaVNn1DlA+TwUG7mQgpSjqCfFcnyRd67R4XkcpjUEd4mDnja4mgEYkwITF3D4XAB2HPYJYB6PMYmBttqK9Dcka3WE8mgLBCDS+QVQURZqDvVmweYg0sPLGUdAQbV/Hpcd7B5eyjNrmojorkVDDR8D6IiUiZreDVv766nOneNyCQTkXrNKuu3owSEinWIo/P+bLfu71CSDitvR+s8EIXM9OhucNAKmN5uN9SKygd5ff/5w942F2lIMJHYn4GxukxH+M86g3AInBY7h9i+liflFO3QkTC0pcH29VplCWwoiwCMkR5uvCI7M4rg3VBDddx0Aw3q4FgyqpJYh8sy5thlMLk7CDkaWNw81MQzFbwkRPVhkQOKL2CzgbzZ5tdn3eYZNFuLmNo5+GJQbRAQDEmDF6921QauI4FjUARpq5bHKccmDCy/Nbb1qj52YJJ1aXm0xWKZqrwnvsw4QiaCZvk6/ISflCB+IoY97ZeNLYqJg4lPmAHx6XE4JW01sa4vEyAiRZMLdCeCgHnR2YlGe3Ns/NjCXyZSZOzQ8+o0mGWeGi9yo4rwzQEkUCnYYqj8L+QD9A8SlcjIer1KgHFSGZo65FCRIcjkDGJDlXx6BS1/Uk7IFs2rxi8BLsr5kjyxVoUzQTFFcR6YZMQlNTzsgTP+sYAEer3jMK6C1xjeRQAXzDAOuzEegrNRL409QbTsumxsMt762Y4DoARsRzirgrHNkS3k2PGrBgd033p6TFkg50b6evXLe0h3NlYbust4OpUHJKBD8kHSwjlk+W/xLgYT7n+IBbOVkt4oF9BKh4dg5i+bBZQ7EX1QejawUdtaaPCV+ary3tsqJFts77xRSJMixvdfLj7VlULBKrtb6wv2ju9PmxiEyIh/3+enegOeQMDUdOZ/9qLg8xuhNS0W+xsgc+sQ2saTsyh5rspMN+Rjj5+qNJx8nuhaZXuMEDy3OPDChv+QA1N/IhasstmiV7HcGhbsIpsUZKv/EK2RkM1Q6LL4sV3Sr1lqjELMighq0O5m4sG1GVNlbGBOgfS6jlp07ScLtu69vR11hlkAmckl6XQX9EzhiDxCyMghA8F4MkNOnZXLpc6ZiINmIXtPfmjQY4TgfX1RwSzWjnnpLH2goQbYtCChpBfPtlckBNGtwJmmn32tz+LrfTwC5kYlkf3f3Mmof8YMUhVyHrqmuyn5FJgJpiKG1yfcD0swVOwICpCwI526s80L6wAoS1XkB91dIyXo5PSzVJPFn8lckYEX7f5DMRoe+bo0fJqwsuTbGYMm+rfw7jDoJe218nmFDThKxP0jHCgwZnwYoY+zoFHwPfYM4y2AASsATT1MsfOe/pXeSij+NAka2DXnq8dkdZHszWp/j6hGqL/m85b27bpsI5GF6nPFScVXjl8WHJQBiJpuPzJNmBaqWXvrvQuBQEoDS+ZaqBLsyQ1gt4tOXOQ08VBUZ7qiTmIaKkvSs8XlKy7EVy3jd5FLCi4C6Ao+pj+Nd3+N8QQGrA1qt+i736OdqAxtyNoRKgVXzsRsCbBXT5bkmtc8bqjj4hNmzB5C/PNZ2RvnNvLLLqlBu/TtoUK7/qElJAFPRgBK8bVz7sjrHiTpCkgXAeZrjSAyRuUmpMvxBRklrYhDyw147dpYJAqrAgoE6k1EePqb1MKZ/yjiSaWGcKyej+QAkCYNAQnVl4wgAKCEmmu0JjWEBSaQDje8eHEG1gfy35YD9SvZE8dR1+kfEQNAVFYfp+clbRQbGFj3tFcGawGycvtsVbhcubCJ2wWTKz24qNRxlpM8uxq3NOYZVa8G/NIe3jqbg1fDFFQysGMIcjselkz/tLFg/CfjAXQSvO9McZlv4MLw/9rn9VT+UqJ2LBxkICr7GacwHSNu8NR6cnAcOCyNQLtLklRLSBts/0z9TUgJ1GvKPGYhcHVUibguk0B53S4oStaUz9aP5OtuQ3ZSqP+6MRu59Gf6J99eXmnVga8GD/NRc1Ja3amnCwn6MXFw77tb0aZNQXpnxG9tlm7ZWrD+8eywLSiKp6nALbHQlQ+RHA3Nh2rDezyUcZ6plmnF2kNzyDdxoTh5GEq8vzadmwmpNfhVZSj0c4DB7xMR5cI5gRWo0uFfJyKtQGCLL3DgD0G/LxLJhvpNBGEsFMLAPEd32b1d0yoqTHFUDfY6SRKmpoBSIsUlca8K2ixnRhHJeYZ0HRRqvlGZiVcscPCYvsloD1Pt/j5TC8j5VqtW2PHnIx9HwTkbR8A1+jSlWA4u9cG+7Ldcf2EnHDWW78cgkcfMWv5uWjUjKQUO2EmY+cxufJm+PbjgkIykACfMNPB5KY8BLnTjAsqo6LIECKw/TEyebYiksjbC5ew8O/VJvsqER2DUSIbpD0f2anH2/BEjEBlPBqwUXvZ1Sy+v6KOc5/VFDpdxz+lQKaNA0B3byGW2GOwxetpucZgzg5lsxzyjnqX1/4vGyuRSC80yO85wj7S71iqO1U4c8x8K2KSbIkjdsiBM2ecw9LVUsOJz3Tih9o84eF8OQEO/DbhX3xYfhKaMTvFW5w7pWJAtvDJGPijEnf6uZ53yWgZaP7WZuyvP9rXQkkrqpFndaHAq7XAcIpHddrjVuWvZwTizaCWedXwZ1nBb8h6T+HEeZSJ8bkwqCmgV6trMUXPdH9SmMvIdosPPi0gIx0HaV8+jwucLZRxK1yE90ZbSet4IixksgPeMgTzyBKC+7Z983E2uMbFx9sb1X1rD60pCk6GfiibdwxKVuysS8IRPdCTcqqLSxlWrJgA3ZyZDqyG8TUf4vN1hjlKwvsu5iJb6MSKw0xzI/EyVBCuKr+KDKp7LplcsnjMq8M+S40V2FqTCkrt14pygM2uwMVK4m0c4xh9OVHTJDgZzQKFjnRNn99j4+NhCuOjcqM/kDCV76SyQz02hu4li1hnmEjrHa3xLJEVrY53fdl3Y+ENnhtyEtEEfXp+awbkfZ4XDZFsJi4dqXS0myljPdUK0gmSfpNL3PQ81mLEDxwyllwU5hYEeoUQ5oyGy0q4lpVgQfUpRHc+eKCtjxtx85l1UQX1F8H9cZ5hvyBZlvLvfxGVDkrSZmKkMgQJd28aq7SzcGpr9IpCYzJXa3Mj95YW2sDkWoInqw8LU1rZ+GedIEzPndD/tySqJAKSeOWYsbOueO6v+typNhXbBhhRbGs0Cr1FteIFVqbpya/C0UTVwSqy4Fe6k1TIZH5y5iKo0rkkBRWI=\"}', '2020-03-22 22:47:11');

-- --------------------------------------------------------

--
-- Stand-in structure for view `projectlist`
-- (See below for the actual view)
--
CREATE TABLE `projectlist` (
`id` varchar(64)
,`creatorId` varchar(64)
,`title` text
,`description` text
,`date` datetime
,`creatorName` varchar(100)
,`wid` varchar(64)
);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(64) NOT NULL,
  `creatorId` varchar(64) NOT NULL,
  `workspaceId` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='data about the projects is stored here';

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `workspaceId` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`workspaceId`, `userId`) VALUES
('6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', 'maBswfIfBRPlG5Lxjl2ut97QoEJ2'),
('6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', 'ES9SIINQYQeYpCuSGkLOVXokRVd2'),
('6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', 'w4ks61XWs7UfIwgdOYrJq65FHZn1');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pic` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='data about the users';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `pic`, `date`) VALUES
('ES9SIINQYQeYpCuSGkLOVXokRVd2', 'karthik koppaka', 'officialkarthikk@gmail.com', 'https://lh3.googleusercontent.com/a-/AOh14GiRyyv8bPa0LUCfI-QjOr6yaN2vwME1NDaLlJvw', '2020-03-22 22:44:34'),
('maBswfIfBRPlG5Lxjl2ut97QoEJ2', 'Karthik Koppaka', 'kk786.koppaka@gmail.com', 'https://lh3.googleusercontent.com/a-/AOh14Ggc-J5UMTNKkmHgzL5N4MxwYsmFm_9BAEvGSfTR', '2020-03-22 22:45:04'),
('w4ks61XWs7UfIwgdOYrJq65FHZn1', 'KARTHIK PARLESHWAR', 'kkparleshwar_19@mc.vjti.ac.in', 'https://lh4.googleusercontent.com/-KZAkK-yQydo/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nBbDNiAKos2Lav4J_ZCZ72Dj-KhZw/photo.jpg', '2020-03-22 22:47:58');

-- --------------------------------------------------------

--
-- Stand-in structure for view `worklist`
-- (See below for the actual view)
--
CREATE TABLE `worklist` (
`id` varchar(64)
,`name` varchar(100)
,`pass` text
,`date` datetime
,`creatorId` varchar(64)
,`uid` varchar(64)
,`creatorName` varchar(100)
,`team` mediumtext
);

-- --------------------------------------------------------

--
-- Table structure for table `workspaces`
--

CREATE TABLE `workspaces` (
  `id` varchar(64) NOT NULL,
  `creatorId` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pass` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='data about the workspace is stored here';

--
-- Dumping data for table `workspaces`
--

INSERT INTO `workspaces` (`id`, `creatorId`, `name`, `pass`, `date`) VALUES
('6uMSjJNgaQiqtIcPTGOrIKtZnmHOEULv', 'ES9SIINQYQeYpCuSGkLOVXokRVd2', 'testing', '{\"iv\":\"Nrmo+aHwVxSyr8JJKrkLrA==\",\"v\":1,\"iter\":10000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"ZdaxmS7Ij98=\",\"ct\":\"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\"}', '2020-03-22 22:45:04');

-- --------------------------------------------------------

--
-- Structure for view `idealist`
--
DROP TABLE IF EXISTS `idealist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `idealist`  AS  select `ideas`.`id` AS `id`,`projects`.`id` AS `pid`,`ideas`.`creatorId` AS `creatorId`,`users`.`name` AS `creatorName`,`ideas`.`title` AS `title`,`ideas`.`description` AS `description`,`ideas`.`date` AS `date` from ((`users` join `projects`) join `ideas`) where `users`.`id` = `ideas`.`creatorId` and `projects`.`id` = `ideas`.`projectId` order by `projects`.`id`,`ideas`.`date` ;

-- --------------------------------------------------------

--
-- Structure for view `messagelist`
--
DROP TABLE IF EXISTS `messagelist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `messagelist`  AS  select `messages`.`id` AS `id`,`users`.`id` AS `uid`,`users`.`name` AS `sender`,`messages`.`date` AS `date`,`messages`.`content` AS `content`,`messages`.`workspaceId` AS `wid` from ((`messages` join `workspaces`) join `users`) where `messages`.`creatorId` = `users`.`id` and `messages`.`workspaceId` = `workspaces`.`id` order by `messages`.`date`,`messages`.`workspaceId` ;

-- --------------------------------------------------------

--
-- Structure for view `projectlist`
--
DROP TABLE IF EXISTS `projectlist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `projectlist`  AS  select `projects`.`id` AS `id`,`projects`.`creatorId` AS `creatorId`,`projects`.`title` AS `title`,`projects`.`description` AS `description`,`projects`.`date` AS `date`,`users`.`name` AS `creatorName`,`workspaces`.`id` AS `wid` from ((`workspaces` join `projects`) join `users`) where `workspaces`.`id` = `projects`.`workspaceId` and `projects`.`creatorId` = `users`.`id` order by `workspaces`.`id` ;

-- --------------------------------------------------------

--
-- Structure for view `worklist`
--
DROP TABLE IF EXISTS `worklist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `worklist`  AS  select `workspaces`.`id` AS `id`,`workspaces`.`name` AS `name`,`workspaces`.`pass` AS `pass`,`workspaces`.`date` AS `date`,`workspaces`.`creatorId` AS `creatorId`,`users`.`id` AS `uid`,(select `users`.`name` from `users` where `users`.`id` = `workspaces`.`creatorId`) AS `creatorName`,(select group_concat(`users`.`email` separator ',') from (`users` join `teams`) where `users`.`id` = `teams`.`userId` and `workspaces`.`id` = `teams`.`workspaceId`) AS `team` from ((`workspaces` join `teams`) join `users`) where `teams`.`workspaceId` = `workspaces`.`id` and `users`.`id` = `teams`.`userId` order by `workspaces`.`id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ideas`
--
ALTER TABLE `ideas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectId` (`projectId`),
  ADD KEY `creatorId` (`creatorId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workspaceId` (`workspaceId`),
  ADD KEY `creatorId` (`creatorId`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workspaceId` (`workspaceId`),
  ADD KEY `creatorId` (`creatorId`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD KEY `workspaceId` (`workspaceId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creatorId` (`creatorId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ideas`
--
ALTER TABLE `ideas`
  ADD CONSTRAINT `ideas_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ideas_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teams_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD CONSTRAINT `workspaces_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
