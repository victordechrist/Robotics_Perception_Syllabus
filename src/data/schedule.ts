export interface Week {
  number: number;
  title: string;
  topics: string;
  date?: string;
  milestone?: string;
}

export const schedule: Week[] = [
  {
    number: 1,
    title: "Course Overview & Math Foundations",
    topics: "Linear algebra, rigid transformations, SE(2) / SE(3), homogenous coordinates.",
    date: "Sep 2",
  },
  {
    number: 2,
    title: "Pinhole Cameras & Projective Geometry",
    topics: "Pinhole model, intrinsic & extrinsic matrix, lens distortion.",
    date: "Sep 9",
  },
  {
    number: 3,
    title: "Image Processing & Edge Detection",
    topics: "Filtering, Sobel, Canny, corner detectors (Harris, FAST).",
    date: "Sep 16",
  },
  {
    number: 4,
    title: "Feature Extraction & Matching",
    topics: "SIFT, ORB, feature descriptors, FLANN / brute-force matching.",
    date: "Sep 23",
  },
  {
    number: 5,
    title: "Epipolar Geometry & Stereo Vision",
    topics: "Essential matrix, Fundamental matrix, disparity map, 3D point cloud generation.",
    date: "Sep 30",
    milestone: "Capstone proposal due",
  },
  {
    number: 6,
    title: "Optical Flow & Motion Tracking",
    topics: "Lucas-Kanade, Farneback, feature tracking across frames.",
    date: "Oct 7",
  },
  {
    number: 7,
    title: "Camera Calibration & Target Detection",
    topics: "Chessboard / ArUco detection, OpenCV calibration pipeline, reprojection error.",
    date: "Oct 14",
  },
  {
    number: 8,
    title: "Midterm Review & Project Checkpoint",
    topics: "In-class review, exam, capstone team sync.",
    date: "Oct 21",
    milestone: "Midterm review",
  },
  {
    number: 9,
    title: "Probability & Sensor Noise Models",
    topics: "Gaussian distributions, covariance, noise propagation, IMU & wheel odometry basics.",
    date: "Oct 28",
    milestone: "Calibration and baseline due",
  },
  {
    number: 10,
    title: "Kalman Filtering (KF & EKF)",
    topics: "State estimation, predict/update cycles, Extended Kalman Filter for non-linear systems.",
    date: "Nov 4",
  },
  {
    number: 11,
    title: "Particle Filtering & Monte Carlo Localization",
    topics: "Non-Gaussian noise, motion model, measurement model, resampling, MCL algorithm.",
    date: "Nov 11",
  },
  {
    number: 12,
    title: "Visual SLAM Foundations",
    topics: "Landmark-based SLAM, loop closure, pose graphs, g2o / GTSAM overview.",
    date: "Nov 18",
    milestone: "Localization and mapping due",
  },
  {
    number: 13,
    title: "ROS 2 Integration & System Architecture",
    topics: "Nodes, topics, services, tf2 transform tree, integrating vision + state estimation.",
    date: "Nov 25",
  },
  {
    number: 14,
    title: "Advanced Topics & Capstone Polish",
    topics: "Neural implicit fields (NeRF), learned descriptors, performance optimization.",
    date: "Dec 2",
  },
  {
    number: 15,
    title: "Final Capstone Presentations",
    topics: "Live demos, poster sessions, final report submission.",
    date: "Dec 9",
    milestone: "Capstone final due",
  },
];
