let peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
    remoteStream = new MediaStream()

    document.getElementById("user-1").srcObject = localStream
    document.getElementById("user-2").srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }
}

let createOffer = async () => {
    console.log("createOffer clicked")
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById("offer-sdp").value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
}

let createAnswer = async () => {
    console.log("createAnswer clicked")
    let offer = JSON.parse(document.getElementById("offer-sdp").value)

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            console.log("Adding answer candidate: ", event.candidate)
            document.getElementById("answer-sdp").value = JSON.stringify(peerConnection.localDescription)
        }
    }

    await peerConnection.setRemoteDescription(offer)
    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
}

let answer = async () => {
    console.log("Answer call")
    let answer = JSON.parse(document.getElementById("answer-sdp").value)
    console.log("answer:", answer)
    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer)
    }
}

init()

document.getElementById("btn-create-offer").addEventListener("click", createOffer)
document.getElementById("btn-create-answer").addEventListener("click", createAnswer)
document.getElementById("btn-answer").addEventListener("click", answer)

