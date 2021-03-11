import React,{useState,useEffect} from 'react'
import {Candidatebox as Candidate, Shortlist, Rejected, Selected} from './Candidatebox';
import '../../styles/candidate.scss';
import ChevronLeftTwoToneIcon from '@material-ui/icons/ChevronLeftTwoTone';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import FreeBanner from '../Candidates/FreeTrialPrompt';
// import Filter from './Filter';
import Loading from '../Loading/Loading';

function Candidateslist({candidates, setcandidates, companyid, jobid, setjobid, mo_backend_url, backend_url}) {
    let history = useHistory();

    const [active_page, setactive_page] = useState([true,false,false,false,false,false]);
    
    const [isloading, setisloading] = useState(false);

    const activepage = (val) =>{
        const def = [false,false,false,false,false,false];
        def[val] = true;
        setactive_page(def);
    }

    const [candidate_type,setcandidate_type] = useState(false);
    const [def,setdef] = useState(true);
    const [iswithd, setiswithd] = useState(false);

    const [isfree, setisfree] = useState(false);

    const [count, setcount] = useState(0);

    const [page_no, setpage_no] = useState(1);

    const [nrml, setnrml] = useState([]);
    const [rejected, setrejected] = useState([]);
    const [selected, setselected] = useState([]);
    const [shortlisted, setshortlisted] = useState([]);

    useEffect(()=>{
        if(companyid !== "" ){
            fetch(backend_url + '/company/find', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    _id:companyid,
                })  
            }).then(response=>response.json())
            .then(data => {
                if(data.success){
                    if(data.result.category === "Free"){
                        setisfree(true);
                    }
                }
            }).catch(()=>console.log("error fetching data"))
        }
    },[backend_url,companyid]);

    useEffect(()=>{
        if(jobid !== ""){
            setisloading(true);
            fetch(mo_backend_url, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    jobid:jobid,
                    timestamp:new Date(),
                    page:page_no
                })  
            }).then(response=>response.json())
            .then(data => {
                if(data.exists){
                    fetch(mo_backend_url + "/" + jobid + "/" + page_no)
                    .then(response=>response.json())
                    .then(data => {
                        if(data.success){
                            setcandidates(data.data);
                            setisloading(false);
                        }
                    }).catch(()=>setisloading(false));
                }
            }).catch(()=>setisloading(false))
        } // eslint-disable-next-line
    },[mo_backend_url,jobid,page_no]);

    useEffect(() => {
        if(candidates.length > 0){ 
            setnrml(candidates)/* .filter((val)=>(val.short === false && val.reject === false && val.select === false)||(val.short === true && val.reject === true && val.select === true))); */
            setshortlisted(candidates.filter((val)=>(val.short === true && val.reject === false && val.select === false)));
            setrejected(candidates.filter((val)=>((val.short === false && val.select === false) && val.reject === true)));
            setselected(candidates.filter((val)=>(val.short === false && val.reject === false && val.select === true)));         
        } // eslint-disable-next-line
    }, [candidates])
    
    useEffect(() => {
        candidate_type && def?setcount(selected.length):def?setcount(nrml.length):candidate_type?setcount(shortlisted.length):setcount(rejected.length);
    }, [selected,def,candidate_type,nrml,rejected,shortlisted]);
  
    const defaultfunc = () =>{
        setcandidate_type(false);
        setdef(true);
        setiswithd(false);
    }

    const shortlist = () =>{
        setcandidate_type(true);
        setdef(false);
        setiswithd(false);
    }

    const reject = () =>{
        setcandidate_type(false);
        setdef(false);
        setiswithd(false);
    }

    const selectfun = () =>{
        setcandidate_type(true);
        setdef(true);
        setiswithd(false);
    }

    // const selectwith = () =>{
    //     setcandidate_type(false);
    //     setdef(false);
    //     setiswithd(true);
    // }

    //console.log(def,candidate_type)
    return (
        <div style={{background:"#eef2f5"}} className='flex-1 w-100 pa4-l pa3'>
            <div className='w-80-l w-100 center flex flex-column'>
                {/* job info */}
                <div className='flex'>
                    <ChevronLeftTwoToneIcon onClick={() => history.push("/Dashboard")} className='self-center dim pointer'/>
                    <div className='flex flex-column items-start'>
                        <p className='ma0 f4-l f5-m f7 pb2 tc'>(Senior) Software Engineer - Python</p>
                        <p className='ma0 pl2 f6-l f7-m f8 gray tc'>New Delhi, India</p>
                    </div>
                </div>
                <div className={`${isfree?'':'hide'}`}>
                    <FreeBanner/>
                </div>
                {/* <Filter/> */}
                <div style={{borderColor:"rgb(249, 246, 246)"}}className='flex self-start w-100 justify-start-l justify-center pt4 ml2-l pb1'>
                        <Button onClick={defaultfunc} variant="contained" className={`cbtn ${def && !candidate_type && !iswithd?'cbtn-active':''}`}>Candidates</Button>
                        <Button onClick={shortlist} variant="contained"   className={`cbtn ${candidate_type && !def && !iswithd?'cbtn-active':''}`}>Shortlisted</Button>
                        <Button onClick={reject}  variant="contained"   className={`cbtn ${!candidate_type && !def && !iswithd?'cbtn-active':''}`}>Rejected</Button>
                        <Button onClick={selectfun}  variant="contained"   className={`cbtn ${candidate_type && def && !iswithd?'cbtn-active':''}`}>Hired</Button>
                        {/* <Button onClick={selectwith}  variant="contained"   className={`cbtn ${iswithd && !def && !candidate_type?'cbtn-active':''}`}>Withdrawal</Button> */}
                    </div>
         
                <div className='mv4 flex justify-between items-center'>
                    <div className="w-20-l w-30-m w-40">
                        <ul className="flex w-100 justify-between ma0">
                            <li onClick={(e)=>{activepage(0);setpage_no(1);}} className={`${active_page[0]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>1</li>
                            <li onClick={(e)=>{activepage(1);setpage_no(2);}} className={`${active_page[1]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>2</li>
                            <li onClick={(e)=>{activepage(2);setpage_no(3);}} className={`${active_page[2]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>3</li>
                            <li onClick={(e)=>{activepage(3);setpage_no(4);}} className={`${active_page[3]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>4</li>
                            <li onClick={(e)=>{activepage(4);setpage_no(5);}} className={`${active_page[4]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>5</li>
                            <li onClick={(e)=>{activepage(5);setpage_no(6);}} className={`${active_page[5]?'activeli':''} pointer f6-l f7-m f7 dim gray list`}>6</li>
                        </ul>
                    </div>
                    <p className="ma0 gray mr2 f6-l f7-m f7 tr">{'All Candidates'}({count})</p>
                </div>
                {isloading?
                    <div className='flex items-center justify-center ma3 br2'>
                        <Loading text="Loading Candidates" />
                    </div>
                :
                    <div className='w-100 flex center flex-column'>
                    {
                        candidates.length<=0 || candidates === undefined ?<div className='mt4 flex justify-center items-center'><p className='ma0 f3-l f4-m f6 gray tc'>No, Candidates matched yet. You will be notified once there are new applicants</p></div>
                        :def && candidate_type?
                            selected.length<=0? <div className='flex mt4 justify-center items-center'><p className='ma0 f3-l f4-m f6 gray tc'>No candidates selected yet</p></div>: selected.map((data,id) =><Selected candidate={data} key={id}/>)
                        :def?
                           nrml.length<=0?<div className='flex mt4 justify-center items-center'><p className='ma0 f3-l f4-m f6 gray tc'>Sorry, No candidates were found!</p></div>:nrml.map((data,id) =><Candidate candidate={data} key={id}/>)
                        :candidate_type?
                           shortlisted.length<=0?<div className='flex mt4 justify-center items-center'><p className='ma0 f3-l f4-m f6 gray tc'>No candidates shortlisted yet</p></div>:shortlisted.map((data,id) =><Shortlist candidate={data} key={id}/>)
                        :
                           rejected.length<=0?<div className='flex mt4 justify-center items-center'><p className='ma0 f3-l f4-m f6 gray tc'>No candidates rejected yet</p></div>:rejected.map((data,id) =><Rejected candidate={data} key={id}/>)
                    }
                </div>
                }
            </div>
        </div>
    )
}

export default Candidateslist
