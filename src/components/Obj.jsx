export default function Obj({Key,value,time}){
    
    return  <div className="flex flex-row ">
                <div>{Key}</div>
                <div>{value}</div>
                <div>{time}</div>
    </div>
}