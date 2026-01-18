import React from 'react';

const trainingTracks = [
  {
    name: 'Dining',
    count: 4,
    detail: 'Assigned to dining training instead of Oasis food.',
  },
  {
    name: 'Oasis food',
    count: 5,
    detail: 'Include Oasis food training in schedule.',
  },
];

const rotationRequirements = [
  'Start date: 27 January with Elevate on 28 January and split onboarding days.',
  'Schedule 3 new starters per rotation, keeping overlap minimal.',
  'Plan 5 total 8-hour shifts split across two locations.',
  'Assign roster shifts after training for the full month.',
];

const coverageNotes = [
  'Ruslana to support roster planning while Patty is away.',
  'Patty to hand over roster details to Frank.',
  'Manager returns Tuesday with a week remaining to finalize.',
  'Names and availability will be confirmed soon (4 candidates listed so far).',
];

function RosterBrief() {
  return (
    <section className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Training Roster Brief</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">January new-starter intake plan</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 px-4 py-2 text-indigo-700 text-sm font-semibold">9 new starters</div>
          <div className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 text-sm font-semibold">2 locations</div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="bg-indigo-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-indigo-900">Training tracks</h3>
          <ul className="mt-3 space-y-3">
            {trainingTracks.map((track) => (
              <li key={track.name} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-700 font-semibold">
                  {track.count}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{track.name}</p>
                  <p className="text-sm text-gray-600">{track.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-purple-900">Rotation & shift plan</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {rotationRequirements.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-amber-900">Coverage & handover</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {coverageNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default RosterBrief;
