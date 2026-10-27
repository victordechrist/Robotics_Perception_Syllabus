export interface Resource {
  category: string;
  name: string;
  url: string;
  description: string;
}

export const resources: Resource[] = [
  // Textbooks
  {
    category: "Textbooks",
    name: "Probabilistic Robotics (Thrun, Burgard, Fox)",
    url: "https://www.probabilistic-robotics.org/",
    description:
      "Definitive textbook covering state estimation, Kalman filtering, particle filters, and SLAM in robotics.",
  },
  {
    category: "Textbooks",
    name: "Computer Vision: Algorithms and Applications (Szeliski)",
    url: "https://szeliski.org/Book/",
    description:
      "Comprehensive guide to 2D and 3D computer vision, camera calibration, stereo perception, and image processing.",
  },

  // Tools
  {
    category: "Tools",
    name: "Python",
    url: "https://www.python.org/",
    description:
      "Primary programming language used across all course assignments, labs, and capstone projects.",
  },
  {
    category: "Tools",
    name: "NumPy",
    url: "https://numpy.org/",
    description:
      "Fundamental package for scientific computing, matrix operations, and linear algebra in Python.",
  },
  {
    category: "Tools",
    name: "OpenCV",
    url: "https://opencv.org/",
    description:
      "Open source computer vision library for image manipulation, feature extraction, and camera calibration.",
  },
  {
    category: "Tools",
    name: "ROS 2",
    url: "https://docs.ros.org/",
    description:
      "Robot Operating System middleware framework for building modular robotics applications and message passing.",
  },

  // References
  {
    category: "References",
    name: "g2o: General Graph Optimization",
    url: "https://github.com/RainerKuemmerle/g2o",
    description:
      "An open-source C++ framework for optimizing graph-based non-linear error functions such as SLAM and bundle adjustment.",
  },
  {
    category: "References",
    name: "GTSAM",
    url: "https://gtsam.org/",
    description:
      "Smoothing and Mapping library implementing factor graphs for robotics state estimation and spatial perception.",
  },
  {
    category: "References",
    name: "KITTI Vision Benchmark Suite",
    url: "http://www.cvlibs.net/datasets/kitti/",
    description:
      "Standard benchmark dataset providing stereo vision, optical flow, visual odometry, and 3D object detection data.",
  },
];
