export interface Prerequisite {
  title: string;
  description: string;
  selfCheckExample: string;
}

export const theme = "From pixels to pose.";

export const courseDescription =
  "Where autonomy begins — an intensive exploration of computer vision, spatial geometry, and state estimation algorithms that enable mobile robots to perceive, localize, and navigate in complex environments.";

export const learningOutcomes: string[] = [
  "Formulate spatial geometry and rigid body transformations in 2D and 3D space using homogeneous matrices and Lie groups.",
  "Build 3D vision pipelines from raw camera images, including calibration, feature matching, and epipolar geometry reconstruction.",
  "Implement state estimation algorithms such as Extended Kalman Filters and Particle Filters to track vehicle motion amidst sensor noise.",
  "Synthesize perception and estimation components into an integrated Visual SLAM pipeline with loop closure and graph optimization.",
  "Architect modular software components using ROS 2, Python, NumPy, and OpenCV adhering to real-time robotics constraints.",
];

export const prerequisites: Prerequisite[] = [
  {
    title: "Python Programming",
    description: "Fluency in Python for scientific computing and software engineering.",
    selfCheckExample: "Can you write vectorized NumPy operations and structure modular object-oriented Python code without external help?",
  },
  {
    title: "Linear Algebra & Calculus",
    description: "Solid grasp of matrix operations, coordinate transformations, and multivariate calculus.",
    selfCheckExample: "Can you compute matrix multiplication, rank, eigenvalues, and partial derivatives of vector functions?",
  },
  {
    title: "Probability & Statistics",
    description: "Understanding of random variables, probability distributions, and estimation theory.",
    selfCheckExample: "Are you comfortable working with Gaussian distributions, covariance matrices, and applying Bayes' rule?",
  },
];
