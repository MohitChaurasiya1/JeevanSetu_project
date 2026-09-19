import React from 'react';
import PatientSidebar from './PatientSidebar';

const Dashboard = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <PatientSidebar onLogout={onLogout} />

      {/* MAIN CONTENT */}
      <main className="ml-[300px] min-h-screen px-8 py-8">

        {/* ==========================================
            STATS
        ========================================== */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Total Assessments */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-[11px] text-slate-500">
              Total Assessments
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-2xl font-bold text-teal-700">
                3
              </h2>

              <span className="text-[10px] text-slate-400">
                Completed
              </span>

            </div>

          </div>


          {/* Latest Risk */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-[11px] text-slate-500">
              Latest Risk Level
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-2xl font-bold text-slate-900">
                LOW
              </h2>

              <span className="text-[10px] text-slate-400">
                Latest
              </span>

            </div>

          </div>


          {/* Probability */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">

            <p className="text-[11px] text-slate-500">
              Latest Probability
            </p>

            <div className="mt-1 flex items-end justify-between">

              <h2 className="text-2xl font-bold text-slate-900">
                12.0%
              </h2>

              <span className="text-[10px] text-slate-400">
                Latest
              </span>

            </div>

          </div>

        </div>


        {/* ==========================================
            RECENT ASSESSMENTS
        ========================================== */}
        <section className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Assessments
              </h2>

              <p className="text-[10px] text-slate-500">
                Your latest health risk assessments
              </p>
            </div>

            <button className="text-[11px] font-medium text-teal-700 hover:text-teal-800">
              View All
            </button>

          </div>


          {/* Prediction 2 */}
          <div className="mb-2 rounded-xl border border-slate-200 bg-white p-4">

            <div className="flex items-start justify-between">

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prediction #2
                </h3>

                <p className="text-[10px] text-slate-500">
                  9/15/2026
                </p>
              </div>

              <button className="text-[10px] text-teal-700">
                View Details →
              </button>

            </div>

            <div className="mt-3 grid grid-cols-3">

              <div>
                <p className="text-[9px] text-slate-400">
                  Result
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  Low Risk of Diabetes
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Risk Level
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  LOW
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Probability
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  12.0%
                </p>
              </div>

            </div>

          </div>


          {/* Prediction 3 */}
          <div className="mb-2 rounded-xl border border-slate-200 bg-white p-4">

            <div className="flex items-start justify-between">

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prediction #3
                </h3>

                <p className="text-[10px] text-slate-500">
                  9/15/2026
                </p>
              </div>

              <button className="text-[10px] text-teal-700">
                View Details →
              </button>

            </div>

            <div className="mt-3 grid grid-cols-3">

              <div>
                <p className="text-[9px] text-slate-400">
                  Result
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  Low Risk of Diabetes
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Risk Level
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  LOW
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Probability
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  32.0%
                </p>
              </div>

            </div>

          </div>


          {/* Prediction 4 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">

            <div className="flex items-start justify-between">

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prediction #4
                </h3>

                <p className="text-[10px] text-slate-500">
                  9/15/2026
                </p>
              </div>

              <button className="text-[10px] text-teal-700">
                View Details →
              </button>

            </div>

            <div className="mt-3 grid grid-cols-3">

              <div>
                <p className="text-[9px] text-slate-400">
                  Result
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  High Risk of Diabetes
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Risk Level
                </p>

                <p className="text-[11px] font-medium text-red-600">
                  HIGH
                </p>
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  Probability
                </p>

                <p className="text-[11px] font-medium text-slate-800">
                  57.0%
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}
        <section className="mt-6">

          <h2 className="mb-3 text-base font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                New Assessment
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Start a new health risk assessment.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                Prediction History
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Review your previous assessments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                My Profile
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Manage your personal information.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
