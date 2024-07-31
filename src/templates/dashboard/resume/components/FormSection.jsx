import PersonalDetailsForm from "./formSection/PersonalDetailsForm";
import React, { useContext, useState } from 'react'
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button';
import ExperienceForm from "./formSection/ExperienceForm";
import EducationForm from "./formSection/EducationForm";
import ProjectsForm from "./formSection/ProjectsForm";
import SkillsForm from "./formSection/SkillsForm";
import { Navigate, useParams } from "react-router-dom";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const {resumeid} = useParams();

  return (
    <div>
      <div className="flex justify-between">
        <Button size="sm" className="flex gap-2" variant="outline"><LayoutGrid></LayoutGrid>Theme</Button>
        <div className="flex gap-2">
          {activeFormIndex>1 && <Button size='sm' onClick={()=>setActiveFormIndex(activeFormIndex-1)}>Back ‎ ‎ <ArrowLeft></ArrowLeft></Button>}
          {activeFormIndex<6 && <Button disabled={!enableNext} size="sm" className="flex gap-2" onClick={()=>setActiveFormIndex(activeFormIndex+1)}>
            Next <ArrowRight></ArrowRight>
          </Button>}
        </div>
      </div>
      {/* Personal Details */}
      {activeFormIndex==1? <PersonalDetailsForm enableNext={(v)=>setEnableNext(v)}></PersonalDetailsForm>: null}


      {/* Education */}
      {activeFormIndex==2? <EducationForm enableNext={(v)=>setEnableNext(v)}></EducationForm>: null}

      {/* Experience */}
      {activeFormIndex==3? <ExperienceForm enableNext={(v)=>setEnableNext(v)}></ExperienceForm>: null}
      
      {/* Projetcs */}
      {activeFormIndex==4? <ProjectsForm enableNext={(v)=>setEnableNext(v)}></ProjectsForm>: null}

      {/* Skills */}
      {activeFormIndex==5? <SkillsForm enableNext={(v)=>setEnableNext(v)}></SkillsForm>: null}
      {activeFormIndex==6? <Navigate to={/my-resume/+resumeid+'/view'}></Navigate> : null }

    </div>
  );
}

export default FormSection;
