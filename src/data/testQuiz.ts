// Periodic test quizzes — auto-graded MCQs. Each test covers the four labs
// since the previous checkpoint. Single correct answer per question.

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: [string, string, string, string];
  /** Index into `options` of the correct answer. */
  answer: number;
  explanation: string;
}

export const TEST_QUIZZES: Record<string, QuizQuestion[]> = {
  "test-1": [
    {
      id: "q1",
      topic: "Rigid transformations",
      question: "What does SE(3) represent?",
      options: [
        "The group of rigid 3D transformations: rotations and translations",
        "3D scaling transformations",
        "2D image rotations only",
        "Projective transformations"
      ],
      answer: 0,
      explanation: "SE(3) elements are 4x4 homogeneous matrices with R \u2208 SO(3) and translation t \u2014 poses of a rigid body.",
    },
    {
      id: "q2",
      topic: "Rigid transformations",
      question: "Why use homogeneous coordinates for transformations?",
      options: [
        "Rotation and translation compose into a single matrix multiplication",
        "They make matrices square",
        "They remove the need for R",
        "They speed up GPUs"
      ],
      answer: 0,
      explanation: "[R|t] with the homogeneous row lets composition, inversion, and point application all be matrix operations.",
    },
    {
      id: "q3",
      topic: "Rigid transformations",
      question: "What does the Lie algebra log map give you?",
      options: [
        "The twist (small-motion parameters) corresponding to a group element",
        "The derivative of a rotation",
        "The inverse rotation matrix",
        "A random rotation"
      ],
      answer: 0,
      explanation: "exp/log connect the Lie algebra to the group \u2014 the basis for smooth pose interpolation and optimization on SE(3).",
    },
    {
      id: "q4",
      topic: "Pinhole camera",
      question: "In the pinhole model, what does the intrinsic matrix K contain?",
      options: [
        "Focal length and principal point \u2014 the camera's internal geometry",
        "The camera's position in the world",
        "The distortion coefficients",
        "The image resolution only"
      ],
      answer: 0,
      explanation: "K = [[fx, 0, cx], [0, fy, cy], [0, 0, 1]] maps normalized camera coordinates to pixel coordinates.",
    },
    {
      id: "q5",
      topic: "Pinhole camera",
      question: "Why do distant objects appear smaller in a pinhole image?",
      options: [
        "Perspective division by depth z scales the projected coordinates",
        "The lens absorbs their light",
        "They emit fewer photons",
        "The sensor clips them"
      ],
      answer: 0,
      explanation: "Projection divides by z: pixel \u221d 1/z \u2014 the fundamental source of perspective in images.",
    },
    {
      id: "q6",
      topic: "Pinhole camera",
      question: "What do radial distortion coefficients model?",
      options: [
        "Bending of rays as a function of distance from the principal point",
        "Rolling shutter effects",
        "Lens vignetting",
        "Motion blur"
      ],
      answer: 0,
      explanation: "Radial distortion: x_d = x(1 + k1r\u00b2 + k2r\u2074 + k3r\u2076) \u2014 corrected during calibration and undistortion.",
    },
    {
      id: "q7",
      topic: "Image processing",
      question: "Why smooth an image before computing gradients?",
      options: [
        "Noise amplifies under differentiation; Gaussian blur suppresses it first",
        "It makes the image prettier",
        "It speeds up convolution",
        "Edges disappear without it"
      ],
      answer: 0,
      explanation: "Derivative operators are high-pass \u2014 noise gets amplified. Gaussian smoothing trades a little edge sharpness for much less noise.",
    },
    {
      id: "q8",
      topic: "Image processing",
      question: "What makes Canny edges cleaner than raw Sobel thresholding?",
      options: [
        "Non-maximum suppression thins edges to one-pixel curves, plus hysteresis thresholds",
        "It uses a bigger kernel only",
        "It detects corners instead",
        "It works on color images only"
      ],
      answer: 0,
      explanation: "NMS keeps only local maxima along the gradient direction; hysteresis links strong and weak edges into continuous curves.",
    },
    {
      id: "q9",
      topic: "Image processing",
      question: "What does the Harris corner response measure?",
      options: [
        "Both eigenvalues of the structure tensor being large \u2014 gradients strong in two directions",
        "Gradient magnitude only",
        "Color variance in the patch",
        "Local contrast only"
      ],
      answer: 0,
      explanation: "Harris score = det(M) - k\u00b7trace(M)\u00b2 on the structure tensor M \u2014 high when both eigenvalues are large.",
    },
    {
      id: "q10",
      topic: "Feature matching",
      question: "What does the Lowe ratio test reject?",
      options: [
        "Matches where the best and second-best candidates are too similar \u2014 ambiguous correspondences",
        "Matches with large descriptors",
        "Matches across different images",
        "Matches with zero distance"
      ],
      answer: 0,
      explanation: "If d1/d2 > 0.8 (typical), the match is ambiguous \u2014 a repeatable point has a clear winner.",
    },
    {
      id: "q11",
      topic: "Feature matching",
      question: "Why are descriptors more robust than raw patches for matching?",
      options: [
        "They encode local structure invariantly, so appearance changes less across views",
        "They are smaller files",
        "They use color information",
        "They require no keypoints"
      ],
      answer: 0,
      explanation: "ORB/SIFT descriptors summarize gradient orientations in a patch \u2014 rotation/scale-aware, so matching survives viewpoint change.",
    },
    {
      id: "q12",
      topic: "Feature matching",
      question: "What geometry do 2D-2D point correspondences constrain?",
      options: [
        "The essential matrix \u2014 relative pose and epipolar geometry between views",
        "The camera intrinsics only",
        "The absolute depth directly",
        "Nothing \u2014 matches are only for mosaics"
      ],
      answer: 0,
      explanation: "x2^T \u00b7 E \u00b7 x1 = 0 for every correspondence \u2014 E encodes R and t up to scale.",
    },
  ],
  "test-2": [
    {
      id: "q1",
      topic: "Stereo vision",
      question: "What does disparity measure in stereo vision?",
      options: [
        "The horizontal pixel shift of a point between left and right images",
        "The vertical misalignment",
        "The color difference",
        "The frame rate difference"
      ],
      answer: 0,
      explanation: "Disparity d relates to depth Z by Z = f\u00b7B/d \u2014 larger shift means closer object.",
    },
    {
      id: "q2",
      topic: "Stereo vision",
      question: "Why does epipolar geometry reduce matching to 1D?",
      options: [
        "Corresponding points must lie on the epipolar line \u2014 search only along it",
        "It makes images grayscale",
        "It removes the need for descriptors",
        "It speeds up the camera"
      ],
      answer: 0,
      explanation: "The fundamental matrix defines epipolar lines; after rectification they're horizontal, so matching scans rows only.",
    },
    {
      id: "q3",
      topic: "Stereo vision",
      question: "What limits stereo depth at long range?",
      options: [
        "Disparity becomes sub-pixel, so depth error grows quadratically with distance",
        "Cameras stop working beyond 10m",
        "The baseline becomes negative",
        "Colors become unreliable"
      ],
      answer: 0,
      explanation: "At long range disparity approaches zero; pixel quantization and noise dominate, and depth uncertainty \u221d Z\u00b2.",
    },
    {
      id: "q4",
      topic: "Optical flow",
      question: "What is the brightness constancy assumption?",
      options: [
        "A point's intensity stays constant as it moves between frames",
        "The scene lighting never changes",
        "Objects move at constant velocity",
        "The camera never rotates"
      ],
      answer: 0,
      explanation: "I(x,y,t) = I(x+u, y+v, t+1) \u2014 brightness at the new location equals brightness at the old.",
    },
    {
      id: "q5",
      topic: "Optical flow",
      question: "What is the aperture problem in optical flow?",
      options: [
        "Motion parallel to an edge is unobservable from local brightness alone",
        "The camera aperture is too small",
        "Flow only works on circular features",
        "Edges always produce zero flow"
      ],
      answer: 0,
      explanation: "Along a straight edge, shifting parallel to it changes nothing locally \u2014 the tangential flow component is ambiguous.",
    },
    {
      id: "q6",
      topic: "Optical flow",
      question: "How does Horn-Schunck differ from Lucas-Kanade?",
      options: [
        "HS computes dense flow with a global smoothness prior; LK tracks sparse features with local windows",
        "HS is always more accurate",
        "LK works on videos only",
        "HS requires calibration"
      ],
      answer: 0,
      explanation: "Horn-Schunck minimizes brightness error + smoothness over the whole image \u2192 dense flow. Lucas-Kanade solves per-window \u2192 sparse, robust.",
    },
    {
      id: "q7",
      topic: "Camera calibration",
      question: "What does camera calibration estimate?",
      options: [
        "Intrinsics (focal length, principal point, distortion) and often extrinsics",
        "The camera's brand",
        "The sensor temperature",
        "The frame rate"
      ],
      answer: 0,
      explanation: "A known 3D pattern (checkerboard) with detected corners gives correspondences to solve for K and distortion coefficients.",
    },
    {
      id: "q8",
      topic: "Camera calibration",
      question: "Why undistort images before stereo matching?",
      options: [
        "Distortion violates the pinhole model that epipolar geometry assumes",
        "It makes images smaller",
        "It removes noise",
        "Cameras require it legally"
      ],
      answer: 0,
      explanation: "Radial/tangential distortion bends rays; epipolar lines are only straight in the ideal model. Undistort first, then rectify.",
    },
    {
      id: "q9",
      topic: "Camera calibration",
      question: "What does reprojection error measure?",
      options: [
        "The pixel distance between observed points and their projection from calibrated 3D",
        "The camera's resolution",
        "The depth accuracy",
        "The lens's brand quality"
      ],
      answer: 0,
      explanation: "Reproject each 3D point with estimated K, [R|t] and compare to detected pixels \u2014 RMS error should be sub-pixel for good calibration.",
    },
    {
      id: "q10",
      topic: "Midterm synthesis",
      question: "Which pipeline produces metric depth from a stereo pair?",
      options: [
        "Calibrate \u2192 undistort \u2192 rectify \u2192 match \u2192 disparity \u2192 triangulate",
        "Match first, calibrate later",
        "Flow alone gives depth",
        "A single image suffices"
      ],
      answer: 0,
      explanation: "Every stage matters: calibration for geometry, rectification for search, matching for correspondences, disparity for depth.",
    },
    {
      id: "q11",
      topic: "Midterm synthesis",
      question: "Why is monocular depth estimation harder than stereo?",
      options: [
        "A single view lacks the disparity baseline \u2014 scale is ambiguous",
        "Monocular cameras are cheaper",
        "Depth is impossible to estimate",
        "Monocular images are blurrier"
      ],
      answer: 0,
      explanation: "With one view, absolute scale is unobservable (the aperture/scale ambiguity); stereo's known baseline resolves it.",
    },
    {
      id: "q12",
      topic: "Midterm synthesis",
      question: "What role does the essential matrix play in two-view geometry?",
      options: [
        "It encodes the relative pose (R, t up to scale) between two calibrated views",
        "It stores image pixels",
        "It calibrates the cameras",
        "It undistorts images"
      ],
      answer: 0,
      explanation: "x2^T E x1 = 0 constrains correspondences; decomposing E yields R and t (up to scale) \u2014 the foundation of visual odometry.",
    },
  ],
  "test-3": [
    {
      id: "q1",
      topic: "Sensor noise",
      question: "Why model sensor noise as Gaussian with a covariance matrix?",
      options: [
        "It captures both per-axis variance and correlations, weighting fusion by uncertainty",
        "Because all noise is Gaussian",
        "To make the sensor faster",
        "To encrypt the measurements"
      ],
      answer: 0,
      explanation: "z = Hx + v with covariance R: the filter trusts low-variance measurements more, and correlations prevent double-counting.",
    },
    {
      id: "q2",
      topic: "Sensor noise",
      question: "What does the Kalman gain balance?",
      options: [
        "Prior belief uncertainty against measurement uncertainty",
        "CPU speed against accuracy",
        "Image brightness against contrast",
        "Past measurements against future ones"
      ],
      answer: 0,
      explanation: "K = P\u00b7H^T\u00b7(H\u00b7P\u00b7H^T + R)\u207b\u00b9 \u2014 when measurement noise R is small, gain rises and the filter trusts the sensor.",
    },
    {
      id: "q3",
      topic: "Kalman filter",
      question: "What are the two steps of the Kalman filter cycle?",
      options: [
        "Predict (propagate state with motion model) then update (fuse measurement)",
        "Train then test",
        "Compress then decompress",
        "Forward then backward passes"
      ],
      answer: 0,
      explanation: "Predict: x\u207b = Fx, P\u207b = FPF^T + Q. Update: fuse z via the Kalman gain. Repeat per timestep.",
    },
    {
      id: "q4",
      topic: "Kalman filter",
      question: "When does the Kalman filter lose optimality?",
      options: [
        "When dynamics or noise are nonlinear/non-Gaussian",
        "When the state has more than 3 dimensions",
        "When there are no measurements",
        "When the matrix F is singular"
      ],
      answer: 0,
      explanation: "EKF linearizes nonlinear models; UKF uses sigma points; particle filters drop Gaussian assumptions entirely.",
    },
    {
      id: "q5",
      topic: "Kalman filter",
      question: "What is observability in filtering?",
      options: [
        "Whether the state can be determined from the measurements over time",
        "Whether the sensor is visible",
        "Whether the filter converges instantly",
        "Whether the covariance is positive"
      ],
      answer: 0,
      explanation: "If a state component never affects measurements, no filter can estimate it \u2014 observability is the structural requirement.",
    },
    {
      id: "q6",
      topic: "Particle filters",
      question: "How does a particle filter represent belief?",
      options: [
        "As thousands of weighted samples (particles), each a state hypothesis",
        "As a single Gaussian",
        "As a lookup table",
        "As a neural network"
      ],
      answer: 0,
      explanation: "Each particle proposes a state; weights reflect measurement likelihood. Resampling keeps the cloud focused.",
    },
    {
      id: "q7",
      topic: "Particle filters",
      question: "What problem does resampling solve?",
      options: [
        "Weight degeneracy \u2014 after many updates, one particle dominates",
        "Too many particles slow it down",
        "Particles escaping the workspace",
        "The filter diverging mathematically"
      ],
      answer: 0,
      explanation: "Without resampling, effective sample size collapses to 1; systematic resampling duplicates good particles proportionally to weight.",
    },
    {
      id: "q8",
      topic: "SLAM",
      question: "What makes SLAM different from pure localization?",
      options: [
        "The map is unknown and estimated jointly with the pose",
        "It uses no sensors",
        "It requires GPS",
        "It only works outdoors"
      ],
      answer: 0,
      explanation: "Localization assumes a known map; SLAM builds the map while localizing \u2014 the chicken-and-egg coupling is the challenge.",
    },
    {
      id: "q9",
      topic: "SLAM",
      question: "What does loop closure provide in SLAM?",
      options: [
        "A global constraint that corrects accumulated drift when a place is revisited",
        "Faster particle resampling",
        "Better sensor noise models",
        "Automatic map serialization"
      ],
      answer: 0,
      explanation: "Without loop closure, drift grows unboundedly; recognizing a loop adds a pose-graph constraint that distributes the correction.",
    },
    {
      id: "q10",
      topic: "SLAM",
      question: "In pose-graph SLAM, what do nodes and edges represent?",
      options: [
        "Nodes are poses/landmarks; edges are constraints from odometry or observations",
        "Nodes are pixels; edges are gradients",
        "Nodes are sensors; edges are cables",
        "Nodes are frames; edges are timestamps"
      ],
      answer: 0,
      explanation: "Odometry edges connect consecutive poses; loop-closure edges connect revisited places \u2014 optimization minimizes constraint error.",
    },
  ],
  "test-4": [
    {
      id: "q1",
      topic: "ROS2",
      question: "What is the core communication pattern in ROS2?",
      options: [
        "Publish-subscribe over typed topics connecting decoupled nodes",
        "Direct function calls between nodes",
        "Shared memory only",
        "A single monolithic loop"
      ],
      answer: 0,
      explanation: "Nodes publish typed messages to topics; subscribers receive them \u2014 the decoupling is the architecture's strength.",
    },
    {
      id: "q2",
      topic: "ROS2",
      question: "What does the TF tree provide?",
      options: [
        "Transforms between coordinate frames, queryable at any timestamp",
        "File path resolution",
        "Thread scheduling",
        "Network routing"
      ],
      answer: 0,
      explanation: "TF maintains the transform graph; lookupTransform('map', 'base_link', t) composes the chain.",
    },
    {
      id: "q3",
      topic: "ROS2",
      question: "What does a launch file do?",
      options: [
        "Declares which nodes to start, with parameters and topic remappings",
        "Optimizes the C++ code",
        "Records rosbag data",
        "Calibrates cameras automatically"
      ],
      answer: 0,
      explanation: "Launch files reproduce the entire stack from one declaration \u2014 nodes, params, remappings, and dependencies.",
    },
    {
      id: "q4",
      topic: "Advanced topics",
      question: "What advantage do learned feature detectors (SuperPoint, LightGlue) have over classical ones?",
      options: [
        "They generalize across domains where hand-crafted features degrade",
        "They are always faster",
        "They require no training",
        "They work only on synthetic data"
      ],
      answer: 0,
      explanation: "Self-supervised training on millions of images makes learned detectors robust to lighting, blur, and domain shift.",
    },
    {
      id: "q5",
      topic: "Advanced topics",
      question: "What is the key idea behind NeRF and 3D Gaussian representations?",
      options: [
        "Encode the scene implicitly in a neural field or Gaussians instead of explicit points",
        "Store images as compressed video",
        "Use only CPU computation",
        "Replace all sensors with cameras"
      ],
      answer: 0,
      explanation: "NeRF learns a radiance field; 3DGS learns anisotropic Gaussians \u2014 both render photorealistic novel views.",
    },
    {
      id: "q6",
      topic: "Advanced topics",
      question: "Why do event cameras interest robotics researchers?",
      options: [
        "They report per-pixel brightness changes asynchronously \u2014 microsecond latency, no motion blur",
        "They are cheaper than standard cameras",
        "They capture color better",
        "They need no calibration"
      ],
      answer: 0,
      explanation: "Events trigger only on change, giving high dynamic range and microsecond temporal resolution \u2014 ideal for fast drones.",
    },
    {
      id: "q7",
      topic: "Capstone integration",
      question: "Why does integration dominate capstone success?",
      options: [
        "Interfaces, timing, and coordinate frames matter more than any single algorithm",
        "Integration is just paperwork",
        "Algorithms don't matter",
        "ROS2 handles everything automatically"
      ],
      answer: 0,
      explanation: "A perfect SLAM with wrong TF frames produces wrong trajectories; timing mismatches corrupt fusion \u2014 the system is the product.",
    },
    {
      id: "q8",
      topic: "Capstone integration",
      question: "What metrics evaluate a visual odometry/SLAM system?",
      options: [
        "ATE/RPE against ground truth, plus runtime and failure rate",
        "Only the final map's visual quality",
        "Only CPU usage",
        "Only the number of features tracked"
      ],
      answer: 0,
      explanation: "Absolute Trajectory Error (ATE) and Relative Pose Error (RPE) against ground truth are the standard benchmarks.",
    },
    {
      id: "q9",
      topic: "Capstone integration",
      question: "What makes a capstone reproducible?",
      options: [
        "Setup instructions, launch files, parameters, and documented limitations",
        "A polished presentation",
        "Hiding the code",
        "Using only standard datasets"
      ],
      answer: 0,
      explanation: "A README with setup steps, committed launch files, and stated limitations lets anyone reproduce your result.",
    },
  ],
};
