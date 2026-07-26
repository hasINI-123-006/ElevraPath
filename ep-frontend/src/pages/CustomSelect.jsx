import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export default function CustomSelect({
    value,
    onChange,
    options,
    width = "w-full"
}) {
    return (
        <div className={`relative ${width}`}>
            <Listbox value={value} onChange={onChange}>
                <Listbox.Button
                    className="
                        relative
                        w-full
                        h-11
                        rounded-lg
                        border
                        bg-white
                        px-3
                        text-left
                        shadow-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                    "
                >
                    <span>{value}</span>

                    <span className="absolute right-3 top-3">
                        <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                    </span>
                </Listbox.Button>

                <Listbox.Options
                    className="
                        absolute
                        z-50
                        mt-1
                        w-full
                        overflow-auto
                        rounded-lg
                        bg-white
                        shadow-xl
                        border
                        max-h-60
                    "
                >
                    {options.map((option) => (
                        <Listbox.Option
                            key={option}
                            value={option}
                            className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${
                                    active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700"
                                }`
                            }
                        >
                            {({ selected }) => (
                                <div className="flex justify-between">
                                    {option}

                                    {selected && (
                                        <CheckIcon className="w-5 h-5" />
                                    )}
                                </div>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    );
}