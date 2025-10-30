import React from "react";
import standardAvatar from "../../../assets/avatar.png";

interface Props {
  avatar: string | undefined;
  fullName: string | undefined;
}

export const Layout: React.FC<Props> = ({ avatar, fullName }) => {
  return (
    <div className="bg-gray-900 rounded-b-xl p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        {/* Аватар и имя */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-700 rounded-full p-0.5">
              <img
                src={avatar ? avatar : standardAvatar}
                alt="Аватар"
                className="w-full h-full rounded-full border-2 border-gray-600"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">{fullName}</h2>
            <p className="text-sm text-gray-400 mt-0.5">Добро пожаловать!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
