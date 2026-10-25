import React, {useState} from 'react';
import {View,Text,Pressable,ScrollView,Modal,TextInput,StyleSheet} from 'react-native';
import {Image} from 'expo-image';
import {LinearGradient} from 'expo-linear-gradient';
import {router,useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {assets} from './components/assets';
import {stylesFor,colors} from './theme';
import {useApp} from './state';
const designs=[require('./design/0.json'),require('./design/1.json'),require('./design/2.json'),require('./design/3.json'),require('./design/4.json')];
type Node={tag:string;className?:string;src?:string;children:(Node|string)[];'data-name'?:string;'data-node-id'?:string};
function plain(n:Node|string):string{return typeof n==='string'?n:n.children.map(plain).join(n.tag==='p'?'':' ');}
function textLines(n:Node|string):string {if(typeof n==='string')return n;if(n.children.some(x=>typeof x!=='string'&&x.tag==='p'))return n.children.map(textLines).join('\n');return n.children.map(textLines).join('');}
function heading(n:Node):string {if(/^Heading [234]$/.test(n['data-name']||''))return textLines(n).replace(/\n/g,' ');for(const c of n.children){if(typeof c!=='string'){const h=heading(c);if(h)return h;}}return '';}
function firstText(n:Node):string{if(n.className?.includes('font-'))return textLines(n).replace(/\n/g,' ');for(const c of n.children){if(typeof c!=='string'){const t=firstText(c);if(t)return t;}}return '';}
export default function DesignScreen({screen}:{screen:number}){
 const params=useLocalSearchParams<{title?:string}>();
 const {data,change}=useApp();const [tab,setTab]=useState('');const [period,setPeriod]=useState('Semana');const [notice,setNotice]=useState('');const [form,setForm]=useState<{kind:string;original:string}|null>(null);const [title,setTitle]=useState('');const [description,setDescription]=useState('');const [pending,setPending]=useState<{label:string;owner:string}|null>(null);
 const root=designs[screen] as Node;const main=root.children.find(n=>typeof n!=='string'&&n['data-name']==='Main') as Node;const header=root.children.find(n=>typeof n!=='string'&&n['data-name']==='Header') as Node;const nav=root.children.find(n=>typeof n!=='string'&&n['data-name']==='Nav') as Node;
 function open(kind:string,original=''){setTitle(original);setDescription('');setForm({kind,original});}
 function act(label:string,owner:string){
 const clean=label.trim();
 if(clean.includes('Voltar')){router.push('/objetivos');return;}
 const ix=['Jornada','Objetivos','Dashboard','Conquistas'].indexOf(clean);if(ix>=0){router.push((['/','/objetivos','/dashboard','/conquistas'] as const)[ix]);return;}
 if(/Visualizar detalhes|^Ver$/.test(clean)){router.push({pathname:'/objetivo',params:{title:owner}});return;}
 if(/histórico/.test(clean)){router.push('/dashboard');return;}
 if(/Criar|Adicionar/.test(clean)){open(clean.includes('Adicionar')?'atividade':'objetivo');return;}
 if(/Editar/.test(clean)){open('editar',owner);return;}
 if(/Excluir|Arquivar|Concluir Objetivo/.test(clean)){setPending({label:clean,owner});return;}
 if(clean==='Concluir'){if(screen===2){setPending({label:'Concluir Objetivo',owner});return;}change({done:[...data.done,owner]});setNotice('Atividade concluída. Cada passo conta!');return;}
 if(/Ativos|Concluídos|Arquivados|Todas as Conquistas|Marcos Obtidos|Próximos Passos/.test(clean)){setTab(clean);return;}
 if(['Dia','Semana','Mês'].includes(clean)){setPeriod(clean);return;}
 if(/Notificações/.test(label)){setNotice('Você está em dia. Continue no seu próprio ritmo.');return;}
 if(/Filtros|Recentes/.test(clean)){setTab(tab==='recentes'?'':'recentes');return;}
 setNotice('Seu progresso está salvo neste dispositivo.');
 }
 function render(n:Node|string,key:string,owner=''):React.ReactNode{
 if(typeof n==='string')return null;
 const name=n['data-name']||'';const label=plain(n);const id=n['data-node-id']||key;const cls=n.className||'';
 if(name.startsWith('Article'))owner=heading(n)||firstText(n);
 if(/^Task \d/.test(name))owner=firstText(n);
 if(screen===1&&cls.includes('bg-white')&&heading(n))owner=heading(n);
 if(screen===1&&name==='2. Cabeçalho do Objetivo & Ações Principais')owner=heading(n);
 if(data.hidden.includes(owner)&&owner)return null;
 if(tab.startsWith('Concluídos')&&name.startsWith('Article')&&!data.completed.includes(owner))return null;
 if(tab.startsWith('Arquivados')&&name.startsWith('Article')&&!data.archived.includes(owner))return null;
 if((!tab||tab.startsWith('Ativos'))&&name.startsWith('Article')&&(data.archived.includes(owner)||data.completed.includes(owner)))return null;
 if(tab.startsWith('Marcos Obtidos')&&name.includes('Próximos'))return null;
 const style:any=stylesFor(cls);
 if(n.tag==='img'){const a=(assets[screen] as any)[n.src||''];return a?<Image key={id} source={a.source} contentFit="contain" style={{width:a.width,height:a.height}} accessibilityIgnoresInvertColors/>:null;}
 if(cls.includes('font-')&&n.children.every(x=>typeof x==='string'||['p','span','strong'].includes(x.tag))){let txt=textLines(n);const paragraph=n.children.find(x=>typeof x!=='string'&&x.tag==='p') as Node|undefined;Object.assign(style,stylesFor(paragraph?.className));if(!style.lineHeight)style.lineHeight=Math.round((style.fontSize||14)*1.4);if(screen===1&&params.title&&txt.replace(/\n/g,' ')==='Transição de Carreira para Tech Lead')txt=params.title;for(const [before,after] of Object.entries(data.edits)){if(txt.replace(/\n/g,' ')===before)txt=after;}if(data.done.includes(owner)&&txt==='Concluir')txt='Concluída';if(data.done.includes(owner)&&txt==='Pendente')txt='Concluída';if(['Dia','Semana','Mês'].includes(txt))style.color=txt===period?'white':colors.muted;return <Text key={id} numberOfLines={cls.includes('text-ellipsis')?1:undefined} style={[{fontFamily:'Inter_400Regular',color:colors.ink,flexShrink:1},style]}>{txt}</Text>;}
 if(name==='Main'){style.paddingTop=8;style.paddingBottom=24;}
 if(name==='Header'||name==='Nav'){style.position='relative';style.width='100%';delete style.top;delete style.bottom;style.flexShrink=0;}
 if(style.width===390)style.width='100%';
 if(name==='Gradient')return <LinearGradient key={id} colors={['#7c3aed','#ab8ffe']} start={{x:0,y:0}} end={{x:1,y:0}} style={style}/>;
 if(n===root)style.backgroundColor=colors.background;
 const iconLabels:Record<string,string>={'9:2191':'Arquivar','9:2194':'Excluir','9:2242':'Excluir','9:2290':'Excluir','9:2338':'Excluir'};
 const isButton=/^(Button|Link)( |$|-)/.test(name)&&!name.includes(':margin')&&!name.includes(':shadow');
 if(isButton){const l=iconLabels[id]||label.trim()||name.replace('Button - ','');const active=['Dia','Semana','Mês'].includes(label.trim());if(active)style.backgroundColor=label.trim()===period?colors.purple:'#e7eefe';return <Pressable key={id} accessibilityRole="button" accessibilityLabel={l} disabled={l==='Concluir'&&data.done.includes(owner)} onPress={()=>act(l,owner||label)} style={({pressed})=>[style,{opacity:pressed?0.65:1,minHeight:32}]}>{n.children.map((c,i)=>render(c,`${key}-${i}`,owner))}</Pressable>;}
 if(cls.includes(' grid ')){const cols=cls.includes('repeat(3')?3:2;const gap=Number(cls.match(/gap(?:-x)?-\[([\d.]+)/)?.[1]||12);return <View key={id} style={[style,{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap}]}>{n.children.map((c,i)=><View key={i} style={{width:cols===3?'31%':'48%'}}>{render(c,`${key}-${i}`,owner)}</View>)}</View>;}
 return <View key={id} style={style}>{n.children.map((c,i)=>render(c,`${key}-${i}`,owner))}</View>;
 }
 function save(){if(!title.trim())return;if(form?.original){change({edits:{...data.edits,[form.original]:title.trim()}});}else change({added:[...data.added,{title:title.trim(),description,kind:form?.kind||'objetivo'}]});setForm(null);setNotice('Salvo. Um novo passo na sua jornada.');}
 return <SafeAreaView style={s.safe} edges={['top','bottom']}><View style={s.frame}>{header&&render(header,'header')}<ScrollView contentContainerStyle={{paddingBottom:16}} showsVerticalScrollIndicator={false}>{render(main||root,'main')}{screen===2&&data.added.filter(x=>x.kind==='objetivo').map((x,i)=><Pressable key={i} onPress={()=>router.push('/objetivo')} style={s.added}><Text style={s.heading}>{x.title}</Text><Text style={s.body}>{x.description}</Text><Text style={s.link}>Ver objetivo →</Text></Pressable>)}{screen===1&&data.added.filter(x=>x.kind==='atividade').map((x,i)=><View key={i} style={s.added}><Text style={s.heading}>{x.title}</Text><Text style={s.body}>{x.description}</Text><Pressable onPress={()=>change({done:[...data.done,x.title]})}><Text style={s.link}>{data.done.includes(x.title)?'Concluída':'Concluir'}</Text></Pressable></View>)}</ScrollView>{nav&&render(nav,'nav')}
 <Modal transparent visible={!!form} animationType="slide" onRequestClose={()=>setForm(null)}><View style={s.overlay}><View style={s.dialog}><Text style={s.heading}>{form?.original?'Editar':`Criar ${form?.kind}`}</Text><Text style={s.body}>Título</Text><TextInput accessibilityLabel="Título" value={title} onChangeText={setTitle} style={s.input} placeholder="Qual será o próximo passo?" autoFocus/><Text style={s.body}>Descrição</Text><TextInput accessibilityLabel="Descrição" value={description} onChangeText={setDescription} style={[s.input,{minHeight:84}]} multiline placeholder="Conte um pouco mais"/><Pressable style={s.primary} onPress={save}><Text style={s.white}>Salvar</Text></Pressable><Pressable style={s.cancel} onPress={()=>setForm(null)}><Text style={s.link}>Cancelar</Text></Pressable></View></View></Modal>
 <Modal transparent visible={!!pending} animationType="fade" onRequestClose={()=>setPending(null)}><View style={s.overlay}><View style={s.dialog}><Text style={s.heading}>{pending?.label}</Text><Text style={s.body}>Deseja {pending?.label.toLowerCase()} este registro?</Text><Pressable style={s.primary} onPress={()=>{if(pending){const field=pending.label.includes('Arquivar')?'archived':pending.label.includes('Concluir')?'completed':'hidden';change({[field]:[...data[field],pending.owner]});}setPending(null);setNotice('Registro atualizado.');}}><Text style={s.white}>Confirmar</Text></Pressable><Pressable style={s.cancel} onPress={()=>setPending(null)}><Text style={s.link}>Cancelar</Text></Pressable></View></View></Modal>
 <Modal transparent visible={!!notice} animationType="fade" onRequestClose={()=>setNotice('')}><Pressable style={s.overlay} onPress={()=>setNotice('')}><View style={s.dialog}><Text style={s.heading}>{notice}</Text><Text style={s.link}>Entendi</Text></View></Pressable></Modal>
 </View></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},frame:{flex:1,width:'100%',maxWidth:480,alignSelf:'center',backgroundColor:colors.background},overlay:{flex:1,backgroundColor:'#151c2766',justifyContent:'center',padding:24},dialog:{backgroundColor:'#fff',borderRadius:20,padding:24,gap:16,width:'100%',maxWidth:440,alignSelf:'center'},heading:{fontFamily:'Inter_600SemiBold',fontSize:18,color:colors.ink},body:{fontFamily:'Inter_400Regular',fontSize:14,color:colors.muted,lineHeight:22},link:{fontFamily:'Inter_500Medium',fontSize:13,color:colors.purple},input:{borderWidth:1,borderColor:'#e2e8f8',borderRadius:12,padding:12,fontFamily:'Inter_400Regular',fontSize:14},primary:{backgroundColor:colors.purple,borderRadius:12,padding:14,alignItems:'center'},white:{fontFamily:'Inter_600SemiBold',color:'#fff'},cancel:{padding:12,alignItems:'center'},added:{margin:16,padding:20,backgroundColor:'#fff',borderRadius:16,gap:12}});
