import { useState } from "react";
import AddExperienceForm from "./components/AddExperience";
import { sampleJobExperiences } from "./sample-data";
import type { JobExperienceType } from "./types";

function App() {
  const [experienceList, setExperienceList] =
    useState<JobExperienceType[]>(sampleJobExperiences);
  const [showAddExperienceForm, setShowAddExperienceForm] = useState(false);
  return (
    <div className="bg-gray-300 min-h-screen p-4">
      <div className="container mx-auto p-4 max-w-4xl border-1 border-gray-400 rounded-xl bg-white shadow-lg">
        <h1 className="text-3xl font-bold mb-6">My Linkedin Profile</h1>
        <div className="flex items-center justify-between p-4 bg-gray-200">
          <h1 className="text-2xl font-bold">Experience</h1>
          <button
            onClick={() => setShowAddExperienceForm(true)}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded-2xl"
          >
            Add
          </button>
        </div>
        {experienceList.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No experience added yet.</p>
          </div>
        )}
        {experienceList.map((jobExperience) => (
          <div className="p-4" key={jobExperience.title}>
            <h2 className="text-xl font-semibold">{jobExperience.title}</h2>
            <p>{jobExperience.company}</p>
            <p className="text-gray-500">
              {jobExperience.startDate.toLocaleString("default", {
                month: "long",
              })}{" "}
              {jobExperience.isCurrent
                ? " - Present"
                : ` - ${jobExperience.endDate?.toLocaleString("default", {
                    month: "long",
                  })} ${jobExperience.endDate?.getFullYear()}`}
            </p>
          </div>
        ))}
        {showAddExperienceForm && (
          <dialog className="fixed inset-0 bg-black/60 flex items-baseline pt-10 justify-center w-full h-full">
            <div className="bg-white rounded shadow-lg container w-3xl">
              <AddExperienceForm
                onSubmit={(newExperience: JobExperienceType) => {
                  setExperienceList((prev) => [newExperience, ...prev]);
                  setShowAddExperienceForm(false);
                }}
                onCancel={() => {
                  setShowAddExperienceForm(false);
                }}
              />
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default App;
