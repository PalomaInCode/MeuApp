import { ViewStyle, TextStyle } from 'react-native';
export const colors={purple:'#7c3aed',background:'#f9f9ff',ink:'#151c27',muted:'#4a4455'};
export function stylesFor(classes=''): ViewStyle & TextStyle {
 const s:any={};
 for(const c of classes.split(' ')){
 const basic:any={'flex-col':{flexDirection:'column'},'flex':{display:'flex',flexDirection:'row'},'items-start':{alignItems:'flex-start'},'items-center':{alignItems:'center'},'justify-center':{justifyContent:'center'},'justify-between':{justifyContent:'space-between'},'justify-end':{justifyContent:'flex-end'},'self-stretch':{alignSelf:'stretch'},'relative':{position:'relative'},'absolute':{position:'absolute'},'shrink-0':{flexShrink:0},'w-full':{width:'100%'},'h-full':{height:'100%'},'size-full':{width:'100%',height:'100%'},'text-center':{textAlign:'center'},'text-white':{color:'#fff'},'bg-white':{backgroundColor:'#fff'},'uppercase':{textTransform:'uppercase'},'line-through':{textDecorationLine:'line-through'},'overflow-clip':{overflow:'hidden'},'py-px':{paddingVertical:1},'pb-px':{paddingBottom:1},'left-0':{left:0},'top-0':{top:0},'right-0':{right:0},'bottom-0':{bottom:0},'min-w-px':{minWidth:1},'flex-[1_0_0]':{flexGrow:1,flexBasis:0,flexShrink:1}};
 if(basic[c])Object.assign(s,basic[c]);
 let m=c.match(/^(p[xytrbl]?|m[xytrbl]?|gap|w|h|size|min-w|min-h|max-w|top|left|right|bottom|rounded|text|leading|tracking)-\[(.+)\]$/);
 if(m){const [,key,v]=m;const n=parseFloat(v);const props:any={p:['padding'],px:['paddingHorizontal'],py:['paddingVertical'],pt:['paddingTop'],pb:['paddingBottom'],pl:['paddingLeft'],pr:['paddingRight'],m:['margin'],mx:['marginHorizontal'],my:['marginVertical'],mt:['marginTop'],mb:['marginBottom'],ml:['marginLeft'],mr:['marginRight'],gap:['gap'],w:['width'],h:['height'],size:['width','height'],'min-w':['minWidth'],'min-h':['minHeight'],'max-w':['maxWidth'],top:['top'],left:['left'],right:['right'],bottom:['bottom'],rounded:['borderRadius'],leading:['lineHeight'],tracking:['letterSpacing'],text:[v.startsWith('#')?'color':'fontSize']};for(const prop of props[key]||[])s[prop]=v.startsWith('#')?v:v.endsWith('%')?v:n;}
 m=c.match(/^bg-\[(.+)\]$/);if(m)s.backgroundColor=m[1];
 m=c.match(/^inset-\[(.+)\]$/);if(m){const v=m[1].split('_');['top','right','bottom','left'].forEach((k,i)=>s[k]=v[i]?.endsWith('%')?v[i]:parseFloat(v[i]||'0'));}
 if(c==='inset-0')Object.assign(s,{top:0,right:0,bottom:0,left:0});
 if(c==='items-baseline')s.alignItems='baseline';
 if(c==='overflow-hidden')s.overflow='hidden';
 if(c==='opacity-90')s.opacity=0.9;
 if(c==='-translate-y-1/2')s.transform=[{translateY:'-50%'}];
 m=c.match(/^(right|left|w|h)-(\d+)\/(\d+)$/);if(m)s[({w:'width',h:'height'} as any)[m[1]]||m[1]]=`${100*Number(m[2])/Number(m[3])}%`;
 m=c.match(/^rounded-t-\[([\d.]+)px\]$/);if(m){s.borderTopLeftRadius=Number(m[1]);s.borderTopRightRadius=Number(m[1]);}
 if(c.startsWith('font-')){if(c.includes('Semi_Bold')||c==='font-semibold')s.fontFamily='Inter_600SemiBold';else if(c.includes('Bold')||c==='font-bold')s.fontFamily='Inter_700Bold';else if(c.includes('Medium')||c==='font-medium')s.fontFamily='Inter_500Medium';else s.fontFamily='Inter_400Regular';}
 if(c.startsWith('drop-shadow'))Object.assign(s,{boxShadow:'0px 1px 2px rgba(0,0,0,0.05)'});
 }
 return s;
}
