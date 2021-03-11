import React from 'react';
import JobCard from './Jobcard';
import { useHistory } from 'react-router-dom';

function Jobcardlist({jobs,setcandidatedata,setjobid}) {
    let history = useHistory();
    return (
        <div className='w-100 flex center flex-column ma-2'>
            {
                jobs.length<=0 || jobs[0] === undefined ?
                <div style={{height:"70vh"}} className='flex flex-column justify-start items-center'>
                    <p className='ma5 f3-l f4-m f6 gray tc'>No, jobs posted yet</p>
                    <button onClick={()=>history.push('/postjob')} style={{background:"#6EB6FF"}} className={`c-shadow h2 pointer h7-mo fw6 f8-mo f7-m f6-l mr2 w-20-l w-20-m w4 bn link dim br2 ph3 pv2 dib white`}>Post a Job</button>
                </div>
                :
                jobs.map((jobdata,id) =><JobCard job={jobdata} setjobid={setjobid} setcandidatedata={setcandidatedata} key={id}/>)
            }
        </div>
    )
}

export default Jobcardlist
