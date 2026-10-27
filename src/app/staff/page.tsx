import { User, ShieldCheck, Mail, Clock, MessageSquare, MapPin } from "lucide-react";

export const metadata = {
  title: "Course Staff | CS 289 / ROB 201",
  description: "Instructional team, teaching assistants, office hours, and communication channels.",
};

interface StaffRole {
  title: string;
  category: "Instructor" | "Teaching Assistant";
  responsibilities: string;
  officeHours: string;
  location: string;
  contactNote: string;
}

const STAFF_ROLES: StaffRole[] = [
  {
    title: "Lead Course Instructor",
    category: "Instructor",
    responsibilities: "Overall course direction, lectures, curriculum architecture, and capstone project evaluation.",
    officeHours: "TBD — Announced during Week 1",
    location: "Robotics Building & Virtual Office",
    contactNote: "Please post on course discussion forum or use staff mailing list for administrative requests.",
  },
  {
    title: "Head Teaching Assistant",
    category: "Teaching Assistant",
    responsibilities: "Lab assignment logistics, ROS 2 / Gazebo simulation support, and midterm review lead.",
    officeHours: "TBD — Weekly scheduled office hours",
    location: "Robotics Computer Lab & Discord/Ed",
    contactNote: "Available during scheduled lab sessions and dedicated Q&A hours.",
  },
  {
    title: "Graduate Teaching Assistant — Vision & SLAM",
    category: "Teaching Assistant",
    responsibilities: "Assisting with stereo vision, epipolar geometry, bundle adjustment, and Visual SLAM lab assignments.",
    officeHours: "TBD — Weekly scheduled office hours",
    location: "Robotics Computer Lab",
    contactNote: "Primary point of contact for Lab 5 through Lab 12 technical questions.",
  },
  {
    title: "Graduate Teaching Assistant — Estimation & Control",
    category: "Teaching Assistant",
    responsibilities: "Assisting with Kalman filtering, sensor fusion, motion models, and Scout rover calibration.",
    officeHours: "TBD — Weekly scheduled office hours",
    location: "Robotics Computer Lab",
    contactNote: "Primary point of contact for state estimation and IMU/odometry integration.",
  },
];

export default function StaffPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
          Teaching Team
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Course Staff & Office Hours
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          The ROB 201 instructional team is dedicated to supporting your learning through lectures, lab mentoring, and dedicated technical office hours.
        </p>
      </div>

      {/* Staff Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAFF_ROLES.map((staff, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                    <User className="h-6 w-6 text-zinc-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {staff.title}
                    </h2>
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 mt-0.5">
                      {staff.category} — Name TBD
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {staff.responsibilities}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span><strong>Office Hours:</strong> {staff.officeHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span><strong>Location:</strong> {staff.location}</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{staff.contactNote}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Contact Info Box */}
      <section className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>How to Contact Course Staff</span>
        </div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          For conceptual and lab debugging questions, please post on the course discussion forum so fellow students can benefit. For private matters (academic accommodations, grade inquiries), email the staff mailing list. Individual email responses may be delayed during peak lab submission periods.
        </p>
      </section>
    </div>
  );
}
