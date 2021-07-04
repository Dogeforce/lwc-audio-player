import { api, LightningElement, wire } from "lwc";
import getBaseDownloadUrl from "@salesforce/apex/AudioFileUtilities.getBaseDownloadUrl";
import { getFieldValue, getRecord } from "lightning/uiRecordApi";
import FIELD_DESCRIPTION from "@salesforce/schema/ContentDocument.Description";
import FIELD_FILEEXTENSION from "@salesforce/schema/ContentDocument.FileExtension";
import FIELD_FILETYPE from "@salesforce/schema/ContentDocument.FileType";
import FIELD_TITLE from "@salesforce/schema/ContentDocument.Title";

const CONTENT_DOCUMENT_FIELDS = [
    FIELD_DESCRIPTION,
    FIELD_FILEEXTENSION,
    FIELD_FILETYPE,
    FIELD_TITLE
];

export default class AudioPlayer extends LightningElement {
    @api audioContentDocumentId;

    baseUrl = "";
    volume = 100;
    audioLoaded = false;
    audioElement;

    @wire(getRecord, {
        recordId: "$audioContentDocumentId",
        fields: CONTENT_DOCUMENT_FIELDS
    })
    contentRecord;

    get audioSrc() {
        return this.baseUrl + this.audioContentDocumentId;
    }

    // file properties

    get fileDescription() {
        return getFieldValue(this.contentRecord.data, FIELD_DESCRIPTION);
    }

    get fileExtension() {
        return getFieldValue(this.contentRecord.data, FIELD_FILEEXTENSION);
    }

    get fileType() {
        return getFieldValue(this.contentRecord.data, FIELD_FILETYPE);
    }

    get fileTitle() {
        return getFieldValue(this.contentRecord.data, FIELD_TITLE);
    }

    // player
    isPlaying = false;
    currentTimePercentage = 0;
    lastPosition = 0;

    get playPauseIcon() {
        if (this.isPlaying) {
            return "utility:pause";
        }
        return "utility:play";
    }

    get playPauseAltText() {
        if (this.isPlaying) {
            return "Pause";
        }
        return "Play";
    }

    get currentTime() {
        return this.audioElement.currentTime;
    }

    get totalTime() {
        return this.audioElement.duration;
    }

    get currentTimeFormatted() {
        let minutes = Math.floor(this.audioElement.currentTime / 60);
        let seconds = this.audioElement.currentTime - minutes * 60;
        return `${minutes}:${
            seconds < 10 ? "0" + seconds.toFixed(0) : seconds.toFixed(0)
        }`;
    }

    get totalTimeFormatted() {
        let minutes = Math.floor(this.audioElement.duration / 60);
        let seconds = this.audioElement.duration - minutes * 60;
        return `${minutes}:${
            seconds < 10 ? "0" + seconds.toFixed(0) : seconds.toFixed(0)
        }`;
    }

    handlePlayPause(e) {
        if (this.audioElement === undefined) {
            this.audioElement = this.template.querySelector("audio");
        }
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            if (!this.audioLoaded) {
                this.audioElement.load();
            }

            this.audioElement.play();

            if (this.lastPosition !== 0) {
                console.log(
                    "setting time to last position: " + this.lastPosition
                );
                this.audioElement.currentTime = this.lastPosition;
            }
        } else {
            this.audioElement.pause();
        }
    }

    handleOnPlay(e) {
        console.log("playback began at " + this.currentTime);
    }

    handleOnPause(e) {
        console.log("paused at " + this.currentTime);
        this.lastPosition = this.currentTime;
    }

    handleOnSeeked(e) {
        console.log("seeked! at " + this.currentTime);
    }

    handleOnSeeking(e) {
        console.log("seeking... at " + this.currentTime);
    }

    handleSkipForward(e) {
        this.audioElement.currentTime += 15;
    }

    handleSkipBack(e) {
        this.audioElement.currentTime -= 15;
    }

    handleOnTimeUpdate(e) {
        this.currentTimePercentage =
            (this.audioElement.currentTime / this.audioElement.duration) * 100;
    }

    connectedCallback() {
        getBaseDownloadUrl().then((res) => {
            this.baseUrl = res;
        });
    }
}
