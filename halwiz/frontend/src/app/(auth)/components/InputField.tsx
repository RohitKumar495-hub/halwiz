import React from "react";

interface InputFieldProps {
    Icon: React.ElementType;
    name: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
    name,
    Icon,
    placeholder,
    value,
    onChange,
}: InputFieldProps) => {
    return (
        <div className="grid gap-1">
            <label htmlFor={name}>{name}</label>
            <div className="flex items-center w-full border-2 p-2 rounded-md border-gray-300 gap-4 ">
                <Icon size={22} color="gray" />
                <input
                    type="text"
                    className="w-full font-semibold rounded-sm outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default InputField;
