(() => {
  "use strict";
  const KEY = "taskflow-tasks-v1", THEME = "taskflow-theme-v1";
  const $ = s => document.querySelector(s);
  let tasks = loadFromLocalStorage(), filter = "all", categoryFilter = "all", query = "", editingId = null, toastTimer;
  const colors = {Work:"#6ea9ff",Personal:"#f0a56c",Study:"#bd95ff",Other:"#86e1c6"};
  function loadFromLocalStorage() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data.filter(t => t && typeof t.id === "string" && typeof t.title === "string").map(t => ({
        id:t.id,title:t.title.slice(0,140),category:["Work","Personal","Study","Other"].includes(t.category)?t.category:"Other",
        dueDate:typeof t.dueDate==="string"?t.dueDate:"",completed:!!t.completed,createdAt:Number(t.createdAt)||Date.now()
      })) : [];
    } catch (e) { console.error("Unable to load tasks",e); return []; }
  }
  function saveToLocalStorage() {
    try { localStorage.setItem(KEY,JSON.stringify(tasks)); return true; }
    catch(e) { console.error("Unable to save tasks",e); toast("Storage unavailable or full. Your change may not persist."); return false; }
  }
  const id = () => crypto?.randomUUID ? crypto.randomUUID() : Date.now()+"-"+Math.random().toString(16).slice(2);
  function toast(msg) { const el=$("#toast"); el.textContent=msg; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2300); }
  function addTask(title,category,dueDate) {
    title=title.trim(); if(!title){$("#hint").textContent="Please enter a task name first.";$("#title").focus();return;}
    tasks.unshift({id:id(),title,category,dueDate,completed:false,createdAt:Date.now()});
    saveToLocalStorage(); $("#taskForm").reset(); $("#category").value=category; $("#hint").textContent="Task added! Keep going.";
    filter="all";categoryFilter="all";query="";$("#search").value="";setActiveButtons();render();$("#title").focus();toast("Task added.");
  }
  function updateTask(taskId,changes) { const t=tasks.find(x=>x.id===taskId);if(!t)return;Object.assign(t,changes);saveToLocalStorage();render(); }
  function removeTask(taskId) { tasks=tasks.filter(t=>t.id!==taskId);saveToLocalStorage();render();toast("Task deleted."); }
  function visibleTasks() {
    const q=query.trim().toLowerCase();
    return tasks.filter(t=>(filter==="all"||(filter==="active"&&!t.completed)||(filter==="completed"&&t.completed))&&(categoryFilter==="all"||t.category===categoryFilter)&&(!q||t.title.toLowerCase().includes(q)||t.category.toLowerCase().includes(q)));
  }
  function fmtDate(s) { const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:y!==new Date().getFullYear()?"numeric":undefined}); }
  function dateStatus(s,done) { if(!s||done)return "";const [y,m,d]=s.split("-").map(Number),due=new Date(y,m-1,d),today=new Date();today.setHours(0,0,0,0);return due<today?" overdue":due.getTime()===today.getTime()?" today":""; }
  function element(tag,cls,text) { const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e; }
  function taskElement(t) {
    const row=element("article","task"+(t.completed?" done":""));
    const check=element("button","check",t.completed?"✓":"");check.type="button";check.setAttribute("aria-label",t.completed?"Mark task active":"Mark task complete");
    check.addEventListener("click",()=>{t.completed=!t.completed;saveToLocalStorage();render();toast(t.completed?"Task completed. Nice work!":"Task moved to active.");});
    const main=element("div","task-main"),title=element("div","task-title",t.title),meta=element("div","meta");
    const chip=element("span","chip",t.category);chip.style.color=colors[t.category];meta.append(chip);
    if(t.dueDate){const due=element("span","due"+dateStatus(t.dueDate,t.completed),"▦ "+fmtDate(t.dueDate));meta.append(due);}
    main.append(title,meta);
    const actions=element("div","actions"),edit=element("button","","✎"),del=element("button","del","×");
    edit.type=del.type="button";edit.title="Edit task";del.title="Delete task";edit.setAttribute("aria-label","Edit "+t.title);del.setAttribute("aria-label","Delete "+t.title);
    edit.addEventListener("click",()=>openEdit(t.id));del.addEventListener("click",()=>{if(confirm(`Delete "${t.title}"?`))removeTask(t.id);});
    actions.append(edit,del);row.append(check,main,actions);return row;
  }
  function render() {
    const shown=visibleTasks();$("#list").replaceChildren(...shown.map(taskElement));$("#empty").classList.toggle("show",shown.length===0);
    $("#empty h3").textContent=tasks.length===0?"Nothing on your list yet":"No matching tasks";$("#empty p").textContent=tasks.length===0?"Add a task above and take the first step.":"Try another filter or search term.";
    const total=tasks.length,done=tasks.filter(t=>t.completed).length,active=total-done,pct=total?Math.round(done/total*100):0;
    [["allCount",total],["activeCount",active],["completedCount",done],["total",total],["active",active],["completed",done],["pillAll",total],["pillActive",active],["pillCompleted",done],["shown",shown.length]].forEach(([key,val])=>$("#"+key).textContent=val);
    $("#percent").textContent=pct+"%";$("#bar").style.width=pct+"%";$("#progressText").textContent=total?(pct===100?"Everything is complete!":"Keep your momentum going"):"Your first win is waiting";
    $("#footerCount").textContent=`Showing ${shown.length} of ${total} task${total===1?"":"s"}`;
    document.title=`${active?`(${active} active) `:""}Taskflow | Productivity Tracker`;
  }
  function setActiveButtons() {
    document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
    document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===categoryFilter));
    $("#pageTitle").textContent=categoryFilter!=="all"?categoryFilter+" tasks":({all:"All tasks",active:"Active tasks",completed:"Completed tasks"}[filter]);
  }
  function openEdit(taskId) {
    const t=tasks.find(x=>x.id===taskId);if(!t)return;editingId=taskId;
    $("#editTitle").value=t.title;$("#editCategory").value=t.category;$("#editDue").value=t.dueDate||"";$("#editDialog").showModal();$("#editTitle").focus();
  }
  function closeEdit() { $("#editDialog").close();editingId=null; }
  $("#taskForm").addEventListener("submit",e=>{e.preventDefault();addTask($("#title").value,$("#category").value,$("#dueDate").value);});
  $("#focusAdd").addEventListener("click",()=>$("#title").focus());$("#emptyAdd").addEventListener("click",()=>$("#title").focus());
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;setActiveButtons();render();}));
  document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{categoryFilter=b.dataset.category;setActiveButtons();render();}));
  $("#search").addEventListener("input",e=>{query=e.target.value;render();});
  $("#editForm").addEventListener("submit",e=>{e.preventDefault();const title=$("#editTitle").value.trim();if(!title||!editingId)return;updateTask(editingId,{title,category:$("#editCategory").value,dueDate:$("#editDue").value});closeEdit();toast("Task updated.");});
  $("#closeEdit").addEventListener("click",closeEdit);$("#cancelEdit").addEventListener("click",closeEdit);
  $("#editDialog").addEventListener("click",e=>{if(e.target===$("#editDialog"))closeEdit();});
  $("#clearCompleted").addEventListener("click",()=>{const n=tasks.filter(t=>t.completed).length;if(!n){toast("No completed tasks to clear.");return;}if(!confirm(`Clear ${n} completed task${n===1?"":"s"}?`))return;tasks=tasks.filter(t=>!t.completed);saveToLocalStorage();render();toast("Completed tasks cleared.");});
  if(localStorage.getItem(THEME)==="light")document.documentElement.classList.add("light");
  function updateTheme(){const light=document.documentElement.classList.contains("light");$("#theme").textContent=light?"☾":"☼";$("#theme").title=light?"Switch to dark theme":"Switch to light theme";}
  $("#theme").addEventListener("click",()=>{document.documentElement.classList.toggle("light");try{localStorage.setItem(THEME,document.documentElement.classList.contains("light")?"light":"dark");}catch{}updateTheme();});
  $("#today").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toUpperCase();
  updateTheme();setActiveButtons();render();
})();