import { Component , ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudiocallService } from '../service/audiocall.service';

@Component({
  selector: 'app-audiocall',
  standalone: true,
  imports: [],
  templateUrl: './audiocall.component.html',
  styleUrl: './audiocall.component.scss'
})
export class AudiocallComponent   implements OnInit{
 constructor(private audioService: AudiocallService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }






}
