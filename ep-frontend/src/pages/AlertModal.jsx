export default function AlertModal({
    open,
    title,
    message,
    confirmText = "OK",
    onConfirm
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">

                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>

                <p className="text-gray-600 mt-3 whitespace-pre-wrap">
                    {message}
                </p>

                <div className="flex justify-end mt-6">

                    <button
                        onClick={onConfirm}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}