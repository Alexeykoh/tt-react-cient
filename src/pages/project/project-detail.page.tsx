import React from "react";
import ProjectDetail from "./project-detail/project-detai.root";

const ProjectDetailPage: React.FC = () => {
  console.log("ProjectDetailPage / re-render");

  return (
    <ProjectDetail.Root>
      <ProjectDetail.Header.Root>
        <ProjectDetail.Header.Top />
        <ProjectDetail.Header.Bottom />
      </ProjectDetail.Header.Root>
      <ProjectDetail.ViewSection />
    </ProjectDetail.Root>
  );
};

export default ProjectDetailPage;
