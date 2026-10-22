import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight,ArrowDown, X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight} from 'lucide-react';
import './style.css';
import profileImage from './assets/profile.png';

// Add media into category folders inside src/assets/projects.
// A filename becomes the project title; files named Project-Name__01, __02 etc.
// become slides of the same project. Legacy prefix filenames still work.
const files = import.meta.glob('./assets/projects/**/*.{jpg,jpeg,png,webp,avif,mp4,webm}', {eager:true,query:'?url',import:'default'});
const names={design:'Graphic Design',video:'Video Editing',ai:'AI Creative',web:'Web Design',social:'Social Media'};
const folderCategories={'graphic design':'design','design':'design','video':'video','video editing':'video','ai creative':'ai','ai':'ai','social media':'social','social':'social','web design':'web','web':'web'};
const prettify = name => name.replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
const projects=Object.entries(files).map(([path,url])=>{
  const parts=path.split('/');
  const filename=parts.pop();
  const folder=parts.at(-1).toLowerCase();
  const stem=filename.replace(/\.[^.]+$/,'');
  const legacy=stem.match(/^(design|video|ai|social|web)__(.+?)(?:__(\d+))?$/i);
  const category=folderCategories[folder] || (parts.length > 3 ? folder : (legacy?.[1] || 'others').toLowerCase());
  const rawName=legacy ? legacy[2] : stem.replace(/__(\d+)$/,'');
  const sequence=Number(legacy?.[3] || stem.match(/__(\d+)$/)?.[1] || 1);
  const title=prettify(rawName)||'Untitled';
  return {category,title,sequence,url,isVideo:/\.(mp4|webm)$/i.test(filename)};
}).reduce((acc,item)=>{
  const id=item.category+'__'+item.title.toLowerCase();
  let group=acc.find(p=>p.id===id);
  if(!group){group={id,category:item.category,title:item.title,media:[]};acc.push(group)}
  group.media.push(item);return acc;
},[]).map(p=>({...p,media:p.media.sort((a,b)=>a.sequence-b.sequence)}));

function SmartVideo({src,active=true,controls=false,className=''}){
 const ref=useRef(null);const [visible,setVisible]=useState(false);const [muted,setMuted]=useState(!controls);const [playing,setPlaying]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.35});obs.observe(el);return()=>obs.disconnect()},[src]);
 useEffect(()=>{const el=ref.current;if(!el)return;if(visible&&active){el.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}else{el.pause();setPlaying(false)}},[visible,active,src]);
 return <div className={'video-wrap '+className}><video ref={ref} src={src} muted={muted} playsInline loop preload="metadata" controls={controls} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>{controls&&<button className="sound-toggle" onClick={()=>setMuted(x=>!x)} aria-label={muted?'Unmute':'Mute'}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button>}{!controls&&!playing&&<Play className="video-play" size={24} fill="white"/>}</div>
}
function Media({item,detail=false}){return item.isVideo?<SmartVideo src={item.url} controls={detail}/>:<img src={item.url} loading={detail?'eager':'lazy'} decoding="async" alt={item.title}/>}
const categories=[...new Set(projects.map(p=>p.category))].sort((a,b)=> (names[a]||a).localeCompare(names[b]||b));
const categoryLabel=c=>names[c]||prettify(c).replace(/\b\w/g,x=>x.toUpperCase());
function App(){const [filter,setFilter]=useState('all');const [selected,setSelected]=useState(null);const [slide,setSlide]=useState(0);
 const filtered=projects.filter(p=>filter==='all'||p.category===filter);
 const open=p=>{setSelected(p);setSlide(0);history.replaceState(null,'','#project-'+p.id.toLowerCase().replace(/[^a-z0-9]+/g,'-'))};
 const close=()=>{setSelected(null);history.replaceState(null,'',location.pathname+location.search)};
 useEffect(()=>{const handler=e=>{if(e.key==='Escape')close();if(selected&&e.key==='ArrowRight')setSlide(s=>(s+1)%selected.media.length);if(selected&&e.key==='ArrowLeft')setSlide(s=>(s-1+selected.media.length)%selected.media.length)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[selected]);
 useEffect(()=>{document.body.style.overflow=selected?'hidden':'';return()=>document.body.style.overflow=''},[selected]);
 return <><header className="topbar"><a href="#top" className="wordmark" aria-label="Mason Tang home">M.</a><nav><a href="#work">WORK</a><a href="#about">ABOUT</a><a className="nav-contact" href="mailto:themasonfunnel@gmail.com">CONTACT <ArrowUpRight size={14}/></a></nav></header>
 <main id="top"><section className="hero"><div className="hero-center"><div className="hero-type"><span>MASON</span><span>TANG</span><div className="portrait-placeholder"><img src={profileImage} alt="Mason Tang" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}} /></div></div><p className="hero-tagline">Designing visuals that move people.</p></div><a className="hero-down" href="#work" aria-label="Scroll to work"><ArrowDown size={25}/></a></section>
 <section className="work-section" id="work"><div className="section-heading"><div><span className="overline">01 / SELECTED PROJECTS</span><h2>THE WORK<span className="period">.</span></h2></div><span className="work-count">{filtered.length.toString().padStart(2,'0')} PROJECTS</span></div><div className="filters" role="group" aria-label="Filter projects">{[['all','All Work'],...categories.map(id=>[id,categoryLabel(id)])].map(([id,label])=><button key={id} className={filter===id?'active':''} onClick={()=>setFilter(id)}>{label}</button>)}</div>
 <div className="masonry" key={filter}>{filtered.map((p,i)=><button className="project" key={p.id} onClick={()=>open(p)} aria-label={'View '+p.title}><div className="project-media"><Media item={p.media[0]}/><div className="project-overlay"><span>VIEW PROJECT</span><ArrowUpRight size={20}/></div>{p.media.length>1&&<span className="slides-count">{p.media.length} SLIDES</span>}</div><div className="project-meta"><div><strong>{p.title}</strong><span>{categoryLabel(p.category)}</span></div><ArrowUpRight size={17}/></div></button>)}</div>{!filtered.length&&<div className="empty">No projects in this category yet. Add media to the projects folder.</div>}</section>
 <section className="about" id="about"><span className="overline">02 / A LITTLE ABOUT ME</span><div className="about-grid"><h2>LET'S<br/>CONNECT<span className="period">.</span></h2><div className="about-copy"><p>I create social content, reels, graphics, and websites for digital brands.</p><p>Available for remote creative roles and collaborations worldwide.</p><a className="email-btn" href="mailto:themasonfunnel@gmail.com">GET IN TOUCH <ArrowUpRight size={20}/></a><div className="socials"><a href="https://www.facebook.com/OfficialMasonTang" target="_blank" rel="noreferrer">FACEBOOK ↗</a><a href="https://www.instagram.com/masonfunnel/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><a href="https://www.linkedin.com/in/mason-tang-065a97427/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div></div></section></main><footer><span>© {new Date().getFullYear()} MASON TANG</span><span>SOCIAL · REELS · GRAPHICS · WEB</span><a href="#top">BACK TO TOP ↑</a></footer>
 {selected&&<div className="modal-backdrop" onClick={close} role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={e=>e.stopPropagation()}><div className="modal-top"><div><span className="overline">{categoryLabel(selected.category)}</span><h3>{selected.title}</h3></div><button className="close-btn" onClick={close} aria-label="Close"><X size={22}/></button></div><div className="modal-media"><Media item={selected.media[slide]} detail/></div>{selected.media.length>1&&<div className="modal-controls"><button onClick={()=>setSlide(s=>(s-1+selected.media.length)%selected.media.length)} aria-label="Previous"><ChevronLeft/></button><span>{slide+1} / {selected.media.length}</span><button onClick={()=>setSlide(s=>(s+1)%selected.media.length)} aria-label="Next"><ChevronRight/></button></div>}</div></div>}</>
}
createRoot(document.getElementById('root')).render(<App/>);
