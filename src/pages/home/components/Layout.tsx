import React from "react";
import standardAvatar from "../../../assets/avatar.png";

interface Props {
  avatar: string | undefined;
  fullName: string | undefined;
}

export const Layout: React.FC<Props> = ({ avatar, fullName }) => {
  return (
    <div className="bg-gradient-to-b from-purple-950/90 to-purple-900/80 rounded-b-3xl p-5 border-b border-emerald-500/30 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Аватар и имя */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-purple-600 rounded-full p-0.5">
              <img
                src={avatar ? avatar : standardAvatar}
                alt="Аватар Андрей"
                className="w-full h-full rounded-full border-2 border-purple-950"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">{fullName}</h2>
            <p className="text-sm text-purple-400/60 mt-0.5">
              Добро пожаловать!
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};
