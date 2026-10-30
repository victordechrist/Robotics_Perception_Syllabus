import type { LabExercise } from '../types';

// Week 13 — ROS 2: node lifecycle order — init, node, pub/sub wiring, spin.
export const week13Exercise: LabExercise = {
  labSlug: 'week-13-ros2-integration',
  title: 'Guided Exercise: ROS 2 Pipeline Wiring',
  intro:
    'Assemble the ROS 2 node pipeline in order. One block per step is a decoy — it looks right but is not.',
  steps: [
    {
      id: 'w13-s1',
      order: 1,
      title: 'Node lifecycle',
      instruction:
        'Order the node setup: rclpy.init first, construct the node, declare pubs/subs — never create channels before init.',
      expectedInput: 'rclpy, perception node class',
      expectedOutput: 'initialized node',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: 'rclpy.init()', caption: 'Init rclpy' },
        { id: 'b2', code: 'node = PerceptionNode()', caption: 'Construct node' },
        { id: 'b3', code: 'node.declare_channels()', caption: 'Pub/sub wiring' },
        { id: 'b4', code: 'node.declare_channels()\nrclpy.init()', caption: 'Channels before init', isDistractor: true },
      ],
    },
    {
      id: 'w13-s2',
      order: 2,
      title: 'Subscribe → process → publish',
      instruction:
        'Wire the data flow: subscribe to the camera topic with a callback, run the perception step inside it, publish the result downstream.',
      expectedInput: 'image topic, perception function',
      expectedOutput: 'callback chain',
      solution: ['b1', 'b2', 'b3'],
      blocks: [
        { id: 'b1', code: "self.create_subscription(Image, '/camera', self.cb, 10)", caption: 'Subscribe' },
        { id: 'b2', code: 'det = self.perceive(msg)', caption: 'Process' },
        { id: 'b3', code: "self.pub.publish(self.to_det_msg(det))", caption: 'Publish' },
        { id: 'b4', code: 'self.pub.publish(msg)', caption: 'Raw echo', isDistractor: true },
      ],
    },
    {
      id: 'w13-s3',
      order: 3,
      title: 'Spin, not sleep',
      instruction:
        'Close the lifecycle: keep the node alive with rclpy.spin (event loop), tear down with shutdown — not a while-sleep loop.',
      expectedInput: 'configured node',
      expectedOutput: 'running node + clean exit',
      solution: ['b1', 'b2'],
      blocks: [
        { id: 'b1', code: 'rclpy.spin(node)', caption: 'Event loop' },
        { id: 'b2', code: 'node.destroy_node()\nrclpy.shutdown()', caption: 'Teardown' },
        { id: 'b3', code: 'while True:\n    time.sleep(0.1)', caption: 'Sleep loop', isDistractor: true },
      ],
    },
  ],
};
