import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CropperComponent } from 'angular-cropperjs';
import Cropper from 'cropperjs';
import { SuperImageCropper } from 'super-image-cropper';
export interface ImageCropperSetting {
  width: number;
  height: number;
}
export interface ImageCropperResult {
  imageData: Cropper.ImageData;
  cropData: Cropper.CropBoxData;
  blob?: Blob;
  dataUrl?: string;
}
@Component({
  selector: 'app-angular-cropper',
  templateUrl: './angular-cropper.component.html',
  styleUrls: ['./angular-cropper.component.scss'],
})
export class AngularCropperComponent {
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  @ViewChild('image', { static: true }) image: ElementRef;

  @Input() imageUrl: string = '';
  @Input() settings: ImageCropperSetting;
  @Input() cropbox: Cropper.CropBoxData;
  @Input() loadImageErrorText: string;
  @Input() cropperOptions: any = {};

  @Output() export = new EventEmitter<ImageCropperResult>();
  @Output() ready = new EventEmitter();

  public isLoading: boolean = true;
  public cropper: Cropper;
  public imageElement: HTMLImageElement;
  public loadError: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  file: any;
  @Output() base64 = new EventEmitter();
  @ViewChild('cropperJsRoot') cropperJsRoot: ElementRef;

  cropperInstance: Cropper;
  targetImg: string;
  superImageCropperInstance: SuperImageCropper;
  croppedImageList: string[] = [];

  ngOnChanges(): void {
    if (this.imageUrl) this.targetImg = this.imageUrl;
  }
  onImageUpload(event: any): void {
    this.croppedImage = '';
    this.targetImg = '';

    const file: File = event.target.files[0];
    const maxSize: number = 1500000;
    //console.log(file);

    if (file.size > maxSize) {
      alert('File size exceeds the allowed limit. Please choose a smaller image. Less than 1500Kb. Please compress it.');
      event.target.value = '';
      return
    } else {


      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.targetImg = reader.result as string;
      };
    }
    this.isLoading = false;
  }
  ngOnDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  imageLoadedS(ev: Event) {
    this.loadError = false;

    const image = ev.target as HTMLImageElement;
    this.imageElement = image;

    if (this.cropperOptions.checkCrossOrigin) image.crossOrigin = 'anonymous';

    image.addEventListener('ready', () => {
      this.ready.emit(true);

      this.isLoading = false;

      if (this.cropbox) {
        this.cropper.setCropBoxData(this.cropbox);
      }
    });

    let aspectRatio = NaN;
    if (this.settings) {
      const { width, height } = this.settings;
      aspectRatio = width / height;
     
      
    }

    this.cropperOptions = {
      ...{
        aspectRatio,
        checkCrossOrigin: true,
      },
      ...this.cropperOptions,
    };

    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = undefined;
    }

    this.cropper = new Cropper(image, this.cropperOptions);
    this.isLoading = false;
  }

  imageLoadError(event: any) {
    this.loadError = true;
    this.isLoading = false;
  }

  exportCanvas(base64?: any) {
    const imageData = this.cropper.getImageData();
    const cropData = this.cropper.getCropBoxData();
    const canvas = this.cropper.getCroppedCanvas();
    const data = { imageData, cropData };

    const promise = new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob],'webp', {
          type: blob.type,
        });
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64data = reader.result;
          this.croppedImage = base64data;
          this.base64.emit(base64data);
          
        };
        reader.onerror = () => { };
        reader.readAsDataURL(file);
      },'image/webp');
    });

    promise.then((res: any) => {
      this.export.emit({ ...data, ...res });
    });
  }
}
