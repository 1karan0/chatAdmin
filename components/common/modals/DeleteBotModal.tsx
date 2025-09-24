import { Bot } from "@/types";
import { Button } from "../components/Button";

interface Props {
    setShowDeleteModal : (value:boolean)=>void;
    confirmDelete: ()=>void;
    bot: Bot
}

export default function DeleteBotModal({setShowDeleteModal ,confirmDelete,bot}:Props){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-black border rounded-lg p-5 text-sm w-full max-w-sm">
            <p className="text-zinc-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-red-400">{bot.name}</span>? <br/> This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
    )
}