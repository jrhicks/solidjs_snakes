import {type Setter} from 'solid-js'

const ArrowButton = (props: { label: string, value: string, getBtnKeys: ()=>string[], setBtnKeys: Setter<string[]> }) => {
return (
    <button classList={{
        "text-white font-bold m-1 py-2 px-4 rounded": true,
        "bg-blue-200": props.getBtnKeys().includes(props.value),
        "bg-blue-500": !props.getBtnKeys().includes(props.value)
      }}
      
      onTouchStart={()=>props.setBtnKeys([...props.getBtnKeys(), props.value])}
      onTouchEnd={()=>props.setBtnKeys([...props.getBtnKeys().filter(k => k !== props.value)])}
      onMouseDown={()=>props.setBtnKeys([...props.getBtnKeys(), props.value])}
      onMouseUp={()=>props.setBtnKeys([...props.getBtnKeys().filter(k => k !== props.value)])} 
      onMouseLeave={()=>props.setBtnKeys([...props.getBtnKeys().filter(k => k !== props.value)])} >
        {props.label}
      </button>
    )
}

export default ArrowButton;
