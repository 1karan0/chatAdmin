import { Bot } from "@/types";


export default function AddKnowledge( {bot} : {bot : Bot}) {
  return (
    <div className="p-6 border border-dashed border-zinc-700 rounded-lg text-center">
      <h2 className="text-lg font-medium text-white mb-4">Add Knowledge</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Enhance your bot's capabilities by adding knowledge sources such as documents, URLs, or databases.
      </p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add Knowledge
      </button>
    </div>
  );
}