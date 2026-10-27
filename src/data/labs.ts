export interface Lab {
  slug: string;
  title: string;
  week: number;
  group: "Foundations" | "Vision" | "Estimation & SLAM" | "Capstone";
  description: string;
  hasMdx: boolean;
}

export const labs: Lab[] = [
  {
    slug: "week-1-math-foundations",
    title: "2D & 3D Rigid Transformations",
    week: 1,
    group: "Foundations",
    description:
      "Warm-up: Implement 2D rotation matrices. Core: Implement SE(3) matrix transformation and pose chaining in Python. Boss Level: Benchmark Lie algebra log maps against matrix exponentials.",
    hasMdx: true,
  },
  {
    slug: "week-2-pinhole-camera",
    title: "Pinhole Camera Model & Lens Distortion",
    week: 2,
    group: "Foundations",
    description:
      "Warm-up: Project 3D points onto a normalized 2D image plane. Core: Implement radial and tangential distortion models. Boss Level: Un-distort real camera images in real time with grid interpolation.",
    hasMdx: false,
  },
  {
    slug: "week-3-image-processing",
    title: "Edge Detection & Corner Extractors",
    week: 3,
    group: "Foundations",
    description:
      "Warm-up: Construct Gaussian and Sobel filters using NumPy. Core: Build a full Canny edge detector and Harris corner detector. Boss Level: Implement FAST corner detection with non-maximum suppression.",
    hasMdx: false,
  },
  {
    slug: "week-4-feature-matching",
    title: "Feature Matching & Descriptor Pipelines",
    week: 4,
    group: "Foundations",
    description:
      "Warm-up: Compute Hamming and Euclidean distances between feature vectors. Core: Match ORB features across image pairs using ratio test filtering. Boss Level: Implement a FLANN nearest-neighbor search with KD-trees.",
    hasMdx: false,
  },
  {
    slug: "week-5-stereo-vision",
    title: "Stereo Vision & Disparity Mapping",
    week: 5,
    group: "Vision",
    description:
      "Warm-up: Compute disparity for a calibrated stereo image pair. Core: Triangulate 3D point clouds from matched epipolar features. Boss Level: Build a real-time dense disparity pipeline with block matching.",
    hasMdx: false,
  },
  {
    slug: "week-6-optical-flow",
    title: "Optical Flow & Lucas-Kanade Tracking",
    week: 6,
    group: "Vision",
    description:
      "Warm-up: Implement image gradient and temporal derivative calculation. Core: Build a pyramidal Lucas-Kanade optical flow tracker. Boss Level: Compute dense Farneback flow and visualize velocity vector fields.",
    hasMdx: false,
  },
  {
    slug: "week-7-camera-calibration",
    title: "Camera Calibration with ArUco Targets",
    week: 7,
    group: "Vision",
    description:
      "Warm-up: Detect checkerboard grids and ArUco markers in target images. Core: Estimate camera intrinsics and distortion coefficients using Zhang's method. Boss Level: Quantify and minimize reprojection errors across multiple views.",
    hasMdx: false,
  },
  {
    slug: "week-8-midterm-review",
    title: "Midterm Review & Perception Pipeline Audit",
    week: 8,
    group: "Vision",
    description:
      "Warm-up: Audit baseline camera geometry implementations. Core: Refactor vision modules into a unified benchmark framework. Boss Level: Optimize pipeline throughput to achieve sub-10ms frame processing.",
    hasMdx: false,
  },
  {
    slug: "week-9-sensor-noise-models",
    title: "Sensor Noise & Covariance Propagation",
    week: 9,
    group: "Estimation & SLAM",
    description:
      "Warm-up: Estimate mean and variance from raw IMU sensor noise logs. Core: Implement 2D dead-reckoning odometry with covariance propagation. Boss Level: Simulate non-Gaussian noise and analyze error growth curves.",
    hasMdx: false,
  },
  {
    slug: "week-10-kalman-filter",
    title: "Extended Kalman Filter State Estimation",
    week: 10,
    group: "Estimation & SLAM",
    description:
      "Warm-up: Implement a 1D linear Kalman filter for sensor fusion. Core: Implement an Extended Kalman Filter (EKF) for a 2D differential-drive robot. Boss Level: Handle asynchronous GPS/IMU sensor updates and outlier rejection.",
    hasMdx: true,
  },
  {
    slug: "week-11-particle-filter",
    title: "Monte Carlo Localization & Particle Filtering",
    week: 11,
    group: "Estimation & SLAM",
    description:
      "Warm-up: Implement motion update models for a set of particles. Core: Build a complete Monte Carlo Localization (MCL) filter with importance sampling. Boss Level: Implement low-variance resampling and kid-nap robot recovery.",
    hasMdx: false,
  },
  {
    slug: "week-12-visual-slam",
    title: "Visual SLAM & Graph Optimization",
    week: 12,
    group: "Estimation & SLAM",
    description:
      "Warm-up: Build landmark observation models for SLAM updates. Core: Construct a keyframe-based visual odometry pipeline. Boss Level: Implement loop closure detection and pose-graph optimization with GTSAM.",
    hasMdx: false,
  },
  {
    slug: "week-13-ros2-integration",
    title: "ROS 2 Architecture & Node Pipeline",
    week: 13,
    group: "Capstone",
    description:
      "Warm-up: Create basic ROS 2 publishers and subscribers in Python. Core: Build a tf2 coordinate transform tree connecting camera to robot base. Boss Level: Implement a multi-threaded ROS 2 node pipeline handling live camera streams.",
    hasMdx: false,
  },
  {
    slug: "week-14-advanced-topics",
    title: "NeRF & Learned Feature Descriptors",
    week: 14,
    group: "Capstone",
    description:
      "Warm-up: Train a simple MLP to represent 2D image color fields. Core: Evaluate deep learning feature descriptors (SuperPoint/LightGlue) against ORB. Boss Level: Synthesize 3D novel views from multi-view camera poses using NeRF.",
    hasMdx: false,
  },
  {
    slug: "week-15-capstone-final",
    title: "Capstone Pipeline Benchmarking & Demo",
    week: 15,
    group: "Capstone",
    description:
      "Warm-up: Validate end-to-end telemetry and ground-truth metrics. Core: Execute complete autonomous navigation and SLAM pipeline evaluation. Boss Level: Perform live live-demo verification against dynamic obstacle environments.",
    hasMdx: false,
  },
];
