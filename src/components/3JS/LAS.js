
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';
//TODO
//parses a pointcloud LAS file into something usable
//async 
function parseLASFile(File){

    console.log("parse")
    var header = new createHeader(File);
    var i = 0;
    var PRArray = [];
    var PRStart = header.startOfPD;
    if (header.PDRF === 1){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 2){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF2(File, header,  PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 3){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF3(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 4){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 5){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 6){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF6(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 7){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 8){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 9){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    else if(header.PDRF === 10){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF1(File, header,  PRStart);
                        PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    return PRArray;


    
}

/*
Parses and creates the header object of a LAS file to be used in the parsing of other LAS components
@params File - The LAS file
*/
function createHeader(File){
    //const buffer = new ArrayBuffer(375)
    //buffer.
    const test = new Uint8Array(File.slice(95,97));
    //const fr = new FileReader();
    //fr.readAsBinaryString(File.slice(0,4));
    this.LASF = File.slice(0,4);//fr.result);
    //fr.readAsBinaryString(File.slice(4,6));
    this.FSID = parseInt(File.slice(4,6));
    //Global encording through Number of var length records are skipped
    //fr.readAsBinaryString(File.slice(58,89))
    this.generatingSW = File.slice(58,89)//binToText(fr.result)
    console.log(this.generatingSW)
    //fr.readAsBinaryString(File.slice(104,105));
    this.startOfPD = parseInt(File.slice(96,100));

    this.PDRF = parseInt(File.slice(104,105));
    //fr.readAsBinaryString(File.slice(105,107));
    this.PDRL = parseInt(File.slice(105,107));
    //fr.readAsBinaryString(File.slice(107,111));
    this.LNPR = parseInt(File.slice(107,111));
    //fr.readAsBinaryString(File.slice(111,131));
    this.LNPRBR = parseInt(File.slice(111,131));

    //fr.readAsBinaryString(File.slice(131,139));
    this.XScale = parseFloat(File.slice(131,139));
    //fr.readAsBinaryString(File.slice(139,147));
    this.YScale = parseFloat(File.slice(139,147));
    //fr.readAsBinaryString(File.slice(147,155));
    this.ZScale = parseFloat(File.slice(147,155));
    //fr.readAsBinaryString(File.slice(155,163));
    this.XOffset = parseFloat(File.slice(155,163));
    //fr.readAsBinaryString(File.slice(163,171));
    this.YOffset = parseFloat(File.slice(163,171));
    //fr.readAsBinaryString(File.slice(171,179));
    this.ZOffset = parseFloat(File.slice(171,179));

    //fr.readAsBinaryString(File.slice(179,187));
    this.MaxX = parseFloat(File.slice(179,187));
    //fr.readAsBinaryString(File.slice(187,195));
    this.MinX = parseFloat(File.slice(187,195));
    //fr.readAsBinaryString(File.slice(195,203));
    this.MaxY = parseFloat(File.slice(195,203));
    //fr.readAsBinaryString(File.slice(203,211));
    this.MinY = parseFloat(File.slice(203,211));
    //fr.readAsBinaryString(File.slice(211,219));
    this.MaxZ = parseFloat(File.slice(211,219));
    //fr.readAsBinaryString(File.slice(219,227));
    this.MinZ = parseFloat(File.slice(219,227));
    //start of waveform data packet record through num of extended var len records skipped
    //fr.readAsBinaryString(File.slice(247,255));
    this.NumOfPR = parseFloat(File.slice(247,255));
    //num of pts by return (120 bytes) skipped
}
/*
Parses and returns the x y and z value of a specific point record in the LAS file for PR format 1
@Params File - the LAS file being parsed, header - the parsed header of the LAS file
*/
function createPRF1(File,header, PRStart){
    const fr = new FileReader();
    fr.readAsBinaryString(File.slice(0,4));
    var x = (parseInt(fr.result))*header.XScale + header.XOffset;
    fr.readAsBinaryString(File.slice(4,8));
    var y = (parseInt(fr.result))*header.YScale + header.YOffset;
    fr.readAsBinaryString(File.slice(8,12));
    var z = (parseInt(fr.result))*header.ZScale + header.ZOffset;
    var verticesTemp = [x,y,z];
    return verticesTemp;
}
/*
Parses and returns the x y and z value of a specific point record in the LAS file in PR format 2
@Params File - the LAS file being parsed, header - the parsed header of the LAS file
*/
function createPRF2(File,header, PRStart){
    const fr = new FileReader();
    fr.readAsBinaryString(File.slice(0,4));
    var x = (parseInt(fr.result))*header.XScale + header.XOffset;
    fr.readAsBinaryString(File.slice(4,8));
    var y = (parseInt(fr.result))*header.YScale + header.YOffset;
    fr.readAsBinaryString(File.slice(8,12));
    var z = (parseInt(fr.result))*header.ZScale + header.ZOffset;
    fr.readAsBinaryString(File.slice(24,26));
    var prRed = (parseInt(fr.result));
    fr.readAsBinaryString(File.slice(26,28));
    var prGreen = (parseInt(fr.result));
    fr.readAsBinaryString(File.slice(28,30));
    var prBlue = (parseInt(fr.result));
    var vertsAndColour = [x,y,z, prRed, prGreen, prBlue];
    return vertsAndColour;
}

/*
Parses and returns the x y and z value of a specific point record in the LAS file for PR format 3
@Params File - the LAS file being parsed, header - the parsed header of the LAS file
*/
function createPRF3(File,header, PRStart){
    const fr = new FileReader();
    fr.readAsBinaryString(File.slice(0,4));
    var x = (parseInt(fr.result))*header.XScale + header.XOffset;
    fr.readAsBinaryString(File.slice(4,8));
    var y = (parseInt(fr.result))*header.YScale + header.YOffset;
    fr.readAsBinaryString(File.slice(8,12));
    var z = (parseInt(fr.result))*header.ZScale + header.ZOffset;
    fr.readAsBinaryString(File.slice(32,34));
    var prRed = (parseInt(fr.result));
    fr.readAsBinaryString(File.slice(34,36));
    var prGreen = (parseInt(fr.result));
    fr.readAsBinaryString(File.slice(36,38));
    var prBlue = (parseInt(fr.result));
    var vertsAndColour = [x,y,z, prRed, prGreen, prBlue];
    return vertsAndColour;
}


/*
Parses and returns the x y and z value of a specific point record in the LAS file for PR format 6
@Params File - the LAS file being parsed, header - the parsed header of the LAS file
*/
function createPRF6(File,header, PRStart){
    const fr = new FileReader();
    fr.readAsBinaryString(File.slice(0,4));
    var x = (parseInt(fr.result))*header.XScale + header.XOffset;
    fr.readAsBinaryString(File.slice(4,8));
    var y = (parseInt(fr.result))*header.YScale + header.YOffset;
    fr.readAsBinaryString(File.slice(8,12));
    var z = (parseInt(fr.result))*header.ZScale + header.ZOffset;
    var verticesTemp = [x,y,z];
    return verticesTemp;
}


/*
waveform functionality not implemented, would need to 
*/
function createPRWaveForm(File,header){
    const fr = new FileReader();
    fr.readAsBinaryString(File.slice(0,4));
    var x = (parseInt(fr.result))*header.XScale + header.XOffset;
    fr.readAsBinaryString(File.slice(4,8));
    var y = (parseInt(fr.result))*header.YScale + header.YOffset;
    fr.readAsBinaryString(File.slice(8,12));
    var z = (parseInt(fr.result))*header.ZScale + header.ZOffset;
    var v0 = [x,y,z];

    fr.readAsBinaryString(File.slice(0,8));
    var xfunc = File.slice();
    var yfunc = File.slice();
    var zfunc = File.slice();
    var verticesTemp = v0;
    return verticesTemp;
}


//The visual representation of a LAS pointcloud
function LASObj(props){

    //console.log(props);
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();
    // Subscribe this component to the render-loop, rotate the mesh every frame
    //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
    console.log(props.file)
    let pointsArr = parseLASFile(props.file)
    var verts = [];
    var numOfPointsL = pointsArr.length;
    var i = 0;
    while(i < numOfPointsL){
        verts.push(pointsArr[i][0],pointsArr[i][1],pointsArr[i][2]);
        i++;
    }
    console.log(verts)
    if(verts == undefined){
        return (<points ref={ref} visible={false}></points>);
    }
    return (
        <points
            {...props}
            ref={ref}
        >
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={verts.length / 3} array={verts} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={0xFFFFFF} size={0.25}/>
        </points>
    );
    

}

export default LASObj;