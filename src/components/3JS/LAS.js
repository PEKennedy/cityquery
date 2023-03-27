
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry } from 'three';
//TODO
//parses a pointcloud LAS file into something usable
//async 
function parseLASFile(File){

    console.log("parse")

    const buffer = str2ab(File)
    console.log(buffer)
    let dataview = new DataView(buffer)

    var header = new Header(File,buffer,dataview);
    var i = 0;
    var PRArray = [];
    var PRStart = header.startOfPD;

    //PDRF can be from 0 to 10
    /*if (header.PDRF === 0){

    }*/
    console.log(buffer.byteLength)
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
        console.log("# PR: ",header.NumOfPR)
        while(i < header.NumOfPR){
            PRArray[i] = createPRF3(File, header, PRStart,dataview);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    /*else if(header.PDRF === 4){
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
    }*/
    else if(header.PDRF === 6){
        while(i < header.NumOfPR){
            PRArray[i] = createPRF6(File, header, PRStart);
            PRStart = PRStart + header.PDRL;
            i++;
        }
    }
    /*else if(header.PDRF === 7){
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
    }*/
    else{
        console.error("Unsupported PDRF type: ",header.PDRF)
    }
    return PRArray;


    
}

//modified from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
//convert a string to an array buffer
function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/*
Parses and creates the header object of a LAS file to be used in the parsing of other LAS components
@params File - The LAS file
*/
function Header(File,buffer,dataview){
    //const buffer = new ArrayBuffer(375)
    //buffer.
    //console.log(File.slice(95,97))
    
    //js string.slice is inclusive start, exclusive end
    //array initialized from buffer is start and length (ie. given 2 bytes, 1 for a uint16, 2 for a uint8)


    /*const str = new Uint8Array(buffer,0,4) 
    const num = new Uint8Array(buffer,94,2)
    const num2 = new Uint16Array(buffer,94,1)[0]

    console.log(buffer)
    console.log(str)
    console.log(num)
    console.log(num2)*/

    this.LASF = File.slice(0,4);//fr.result);

    this.FSID = new Uint16Array(buffer,4,2)[0]//parseInt(File.slice(4,6));
    //Global encording through Number of var length records are skipped
    
    this.sysIdentifier = File.slice(26,32)
    this.generatingSW = File.slice(58,32)

    console.log(this.LASF)
    console.log(this.generatingSW)
    console.log(this.sysIdentifier)

    this.startOfPD = new Uint32Array(buffer,96,1)[0];//parseInt(File.slice(96,100));

    this.PDRF = new Uint8Array(buffer,104,1)[0];//parseInt(File.slice(104,105));
    console.log(this.PDRF)
    
    this.PDRL = dataview.getUint16(105);//new Uint16Array(buffer,105,1)[0];//parseInt(File.slice(105,107));
    console.log(this.PDRL)

    this.LNPR = dataview.getUint32(107);//new Uint32Array(buffer,107,1)[0];//parseInt(File.slice(107,111));

    //We need to do this awkward workaraound because the Uint..Array types need to be byte aligned
    this.LNPRBR = new Uint32Array(5);// new Uint32Array(buffer,111,5);//parseInt(File.slice(111,131));
    this.LNPRBR[0] = dataview.getUint32(111);
    this.LNPRBR.set(new Uint32Array(buffer,112,4),1)

    //let transform_info = new Float64Array(buffer,131,12)[0];

    this.XScale = dataview.getFloat64(131);//transform_info[0];//parseFloat(File.slice(131,139));
    this.YScale = dataview.getFloat64(139);//transform_info[1];//parseFloat(File.slice(139,147));
    this.ZScale = dataview.getFloat64(147);//transform_info[2];//parseFloat(File.slice(147,155));

    this.XOffset = dataview.getFloat64(155);//transform_info[3];//parseFloat(File.slice(155,163));
    this.YOffset = dataview.getFloat64(163);//transform_info[4];//parseFloat(File.slice(163,171));
    this.ZOffset = dataview.getFloat64(171);//transform_info[5];//parseFloat(File.slice(171,179));

    this.MaxX = dataview.getFloat64(179);//transform_info[6];//parseFloat(File.slice(179,187));
    this.MinX = dataview.getFloat64(187);//transform_info[7];//parseFloat(File.slice(187,195));

    this.MaxY = dataview.getFloat64(195);//transform_info[8];//parseFloat(File.slice(195,203));
    this.MinY = dataview.getFloat64(203);//transform_info[9];//parseFloat(File.slice(203,211));

    this.MaxZ = dataview.getFloat64(211);//transform_info[10];//parseFloat(File.slice(211,219));
    this.MinZ = dataview.getFloat64(219);//transform_info[11];//parseFloat(File.slice(219,227));
    //start of waveform data packet record through num of extended var len records skipped

    this.NumOfPR = 1//dataview.getBigUint64(247);//new BigUint64Array(buffer,247,1);//new BigUint64Array(buffer,247,1);//parseFloat(File.slice(247,255));

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
function createPRF3(File,header, PRStart,dataview){
    //const fr = new FileReader();
    //fr.readAsBinaryString(File.slice(0,4));
    console.log(PRStart)
    var x = dataview.getInt32(PRStart)*header.XScale + header.XOffset;
    //fr.readAsBinaryString(File.slice(4,8));
    var y = dataview.getInt32(PRStart+4)*header.YScale + header.YOffset;
    //fr.readAsBinaryString(File.slice(8,12));
    var z = dataview.getInt32(PRStart+8)*header.ZScale + header.ZOffset;
    //fr.readAsBinaryString(File.slice(32,34));
    /*var prRed = (parseInt(fr.result));
    //fr.readAsBinaryString(File.slice(34,36));
    var prGreen = (parseInt(fr.result));
    //fr.readAsBinaryString(File.slice(36,38));
    var prBlue = (parseInt(fr.result));*/
    var vertsAndColour = [x,y,z];//, prRed, prGreen, prBlue];
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
    //console.log(props.file)
    let pointsArr = parseLASFile(props.file)
    var verts = [];
    var numOfPointsL = pointsArr.length;
    var i = 0;
    while(i < numOfPointsL){
        verts.push(pointsArr[i][0],pointsArr[i][1],pointsArr[i][2]);
        i++;
    }
    verts = new Float32Array(verts)
    console.log(verts)
    if(verts == undefined || verts.length == 0){
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