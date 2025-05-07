import React from 'react'
import { GeneralFacultyInfo } from './_components/general'
import { FacultyProfile } from './_components/profile'
const page = () => {
  return (
    <div className="p-5 flex flex-col gap-5">
      <GeneralFacultyInfo />
      <FacultyProfile isCompleted={!true} />
    </div>
  );
};

export default page