'use client'

import React, { useEffect } from 'react'
import Modal from "react-modal";
import FileSystemService from "@/app/(admin)/classes/FileSystemService";
import ServerSidePaths from '@/app/(admin)/components/ServerSidePaths';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { ProjectInterface, actionProject, modalOperator } from '@/app/(admin)/interfaces/interfaces';
import Form from '@/app/(admin)/classes/form/Form';
import FormBuilder from '@/app/(admin)/classes/form/FormBuilder';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/context/Auth';
import Tabs from '../../components/StateTabs';
import FormsDeleteModal from '../../components/FormsDeleteModal';
import FormCreationModal from '../../components/FormCreationModal';
import { ActiveFormElement } from '../../components/ActiveFormElement';
import { InActiveFormElement } from '../../components/InActiveFormElement';
import { TokenValidator } from '../../classes/tokenClass';

interface ProjectParams {
    params:{
        user: string;
        project: string;
    }
}

let Puge = ({params}:ProjectParams) => {
  const router = useRouter();
  const { logout } = useAuth();

  const [openTab, setOpenTab] = useState<number>(1);
  const tabLabels: string[] = ["Not Published", "Published"];

  const [modalOpen, setModalOpen] = useState<modalOperator>({currentModalTitle: "", isOpen: false});

  const [nameInput, setNameInput] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<Form>();
  const [actionOnProject, setActionOnProject] = useState<actionProject>({itemTitle:"", itemIndex: -1});
  const [forms, setForms] = useState<Form[]>([]);
  const [projectState, setProjectState] = useState<boolean>();

  async function getForms() {
  
    const projectAltered = params.project.replace(/-/g, ' ');
    let projects = await FileSystemService.getJSONFile(ServerSidePaths.getProjectsPath(params.user)) as ProjectInterface[];
    let project = projects.filter((project) => project.title.replace(/-/g,' ') === projectAltered.replace(/%20/g," "));
    
    setProjectState(project[0].isActive);
    
    const dataForms: Form[] = await FileSystemService.getJSONFile(ServerSidePaths.getFormsPath(params.user, projectAltered).replace(/%20/g,' ')) as Form[];
    
    const buildedForms : Form[] = [];
    
    dataForms.map(form => {
      buildedForms.push(new FormBuilder().formFromObject(form));
    })
    buildedForms.forEach((form)=>{
      form.name = form.getUncleanName()
    })
    console.log("dataForms: ", dataForms);

    setForms(buildedForms);

  }

  useEffect(() => {
    
    const token = Cookies.get("token");
    console.log(token)
    if (!token) {
      logout();
      router.replace("/login"); // If no token is found, redirect to login page
      return;
    }
      // Validate the token by making an API call
      TokenValidator.validateToken(token).catch((error) => {
        console.error(error);
        router.replace("/login");
        });

    getForms();

    const appElement: HTMLElement | null = document.getElementById('outerDiv');
    if (appElement) {
      Modal.setAppElement(appElement);
    }

  }, []);

  return (
    <div className="flex flex-wrap">
      <ToastContainer />
        <div id="outerDiv" className="w-full">


          <FormCreationModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          forms={forms}
          nameInput={nameInput}
          setNameInput={setNameInput}
          selectedForm={selectedForm as Form}
          setSelectedForm={setSelectedForm}
          user={params.user}
          project={params.project}
          />

          <FormsDeleteModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            forms={forms}
            setForms={setForms}
            actionOnProject={actionOnProject}
            setActionOnProject={setActionOnProject}
            user={params.user}
            project={params.project}
          />

          <Tabs activeTab={openTab} setActiveTab={setOpenTab} tabLabels={tabLabels} />

          <div className="relative flex flex-col min-w-72 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={(openTab === 2 ? "block" : "hidden") }  id="link1">
 
                  <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center">
                    {/*Reverses the forms array such that the newest saved is displayed first*/}
                    {forms.map((form, i) => 
                  
                  <ActiveFormElement
                  key={i}
                  index={i}
                  setModalOpen={setModalOpen}
                  setActionOnProject={setActionOnProject}
                  form={form}
                  project={params.project}
                  />

                    )}

                  </div>

                  <div className="float-left m-2">
                    <p className="text-xs font-bold uppercase  shadow-lg rounded block leading-normal text-white bg-palette-500">
                      <Link 
                      href={"/projectCreation"}
                      className='px-5 py-3 bg-palette-500 rounded'>
                        Back to projectpage
                      </Link>
                    </p>
                  </div>
                 

                </div> 
                
                <div className={(openTab === 1 ? "block" : "hidden")}  id="link1">

                  <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 place-items-center">
                    <div 
                      id="newProjectDiv" 
                      className={`grid place-items-center h-25 w-40 border-dashed rounded-lg border-4 border-grey-600 bg-grey-400 inline-block m-24 inline-block bg-grey-400 ${projectState ? 'block' : 'hidden'}`}>
                        <h3 className='pt-2'>New Form</h3>
                        <button title={"New"} className={"text-5xl text-align-center hover:scale-125"}
                        onClick={(e)=>{setModalOpen({currentModalTitle: "newFormModal", isOpen: true});setSelectedForm(undefined)}}
                        >+</button>
                    </div>
                  
                    {/*Reverses the forms array such that the newest saved is displayed first*/}
                    {forms.map((form, i) => 
                      <InActiveFormElement
                    key={i}
                      form={form}
                      project={params.project}
                      setActionOnProject={setActionOnProject}
                      setModalOpen={setModalOpen}
                      index={i}
                        />
                    )}

                  </div>
                  <div className="float-left m-2">
                    <p className="text-xs font-bold uppercase  shadow-lg rounded block leading-normal text-white bg-palette-500">
                      <Link 
                      href={"/projectCreation"}
                      className='px-5 py-3 bg-palette-500 rounded'>
                        Back to projectpage
                      </Link>
                    </p>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Puge