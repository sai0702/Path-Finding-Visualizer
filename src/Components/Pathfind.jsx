import React,{useState, useEffect} from "react";
import Node from "./Node";
import Algo from "../PathfindingAlgo/dijkstras";
import "./Pathfind.css";

const rows= 15;
const cols=20;
///const walls=[[2,3],[4,5],[6,7],[6,8],[9,10],[3,6],[6,4],[4,3],[1,7],[2,5],[3,7]];

const NODE_START_ROW =0
const NODE_START_COL =0
const NODE_END_ROW = rows-1;
const NODE_END_COL = cols-1;

const Pathfind = () =>{

    // CREATES SPOT
    const createSpot =(grid)=>{
        for (let i=0;i<rows;i++){
            for (let j=0;j<cols;j++){
                grid[i][j]= new Spot(i,j);
            }
        }    
    }; 
    
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes , setVisitedNodes] = useState([]);
    
    //ADD NEIGHBOURS
    const addNeighbours = (grid)=>{
        for(let i=0;i<rows;i++){
            for (let j=0;j<cols;j++){
                grid[i][j].addneighbours(grid);
            }
        }
    };
    // CREATES THE GRID
    const initializeGrid = () => {
        const grid=new Array(rows);

        for (let i=0;i<rows;i++){
            grid[i]=new Array(cols);
        }
        createSpot(grid);
        setGrid(grid);
        addNeighbours(grid);
        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        let path = Algo(startNode,endNode);
        startNode.isWall=false;
        endNode.isWall=false;
        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    };





    useEffect(()=> {
        initializeGrid();
    }, []);





    // SPOT CONSTRUCTOR
    function Spot(i,j){
        this.x=i;
        this.y=j;
        this.isStart = this.x ===NODE_START_ROW && this.y ===NODE_START_COL;
        this.isEnd = this.x===NODE_END_ROW && this.y===NODE_END_COL;
        this.g=0;
        this.f=0;
        this.h=0;
        this.neighbours =[];
        this.isWall=false;
        if (Math.random()<0.2){
            this.isWall=true;
        }
        /*for (let k=0;k<walls.length;k++){
            if (i===walls[k][0] && j===walls[k][1]){this.isWall=true;}
        }*/
        this.pevious=undefined;
        this.addneighbours=function(grid)
        {
            let i=this.x;
            let j=this.y;
            if(i>0) this.neighbours.push(grid[i-1][j]);
            if(i<rows-1) this.neighbours.push(grid[i+1][j]);
            if(j>0) this.neighbours.push(grid[i][j-1]);
            if(j<cols-1)this.neighbours.push(grid[i][j+1]);
        };
        
    }

    // GRID WITH NODE
    const gridwithNode = (
        <div>
            {Grid.map((row,rowIndex) => {
                return(
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col,colIndex) =>{
                            const {isStart, isEnd, isWall} =col;
                            return <Node key={colIndex} isStart={isStart} isEnd={isEnd} row={rowIndex} col={colIndex} isWall={isWall}/>;    
                        })}
                    </div>
                );
            })}
        </div>
        
    );

    const visualizeShortestPath = (shortestPathNodes) =>{
        for (let i=0;i<shortestPathNodes.length;i++){
            setTimeout(()=>{
                const node = shortestPathNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path";
            }, 10 * i);
        }
    };

    const visualizePath = () =>{
        for (let i=0;i<=VisitedNodes.length;i++){
            if (i === VisitedNodes.length){
                setTimeout(()=>{
                    visualizeShortestPath(Path);
                }, 20 * i);
            }   else{
                setTimeout(()=>{
                    const node = VisitedNodes[i];
                    document.getElementById(`node-${node.x}-${node.y}`).className ="node node-visited";
                }, 20 * i);
                
            }    
        }
    };

    console.log(Path);
    return (
        <div className="Wrapper">
            <button onClick={visualizePath}>Visualize Path</button>
            <h1>PathFind Component</h1>
            {gridwithNode}
        </div>
    );
};
export default Pathfind;