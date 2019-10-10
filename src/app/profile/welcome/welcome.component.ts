import { Component, OnInit } from '@angular/core';

declare var Swiper: any;
declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    
    
    
    
  constructor() {
      
  }
  
  ngAfterViewInit() {
      this.initSwiper();
     
  }
  
  ngOnInit() {
  }
  initSwiper() {
      const swiperThreeSlides = new Swiper('.swiper-three-slides', {
          centeredSlides: true,
          allowTouchMove: true,

          slidesPerView: 3,
          preventClicks: false,
          loop: true,
          pagination: {
              el: '.swiper-pagination-bullets',
              clickable: true
          },
          cubeEffect: {
              slideShadows: false
          },
          autoplay: {
              delay: 7500,
              disableOnInteraction: false
          },
          keyboard: {
              enabled: true
          },
          breakpoints: {
              991: {
                  slidesPerView: 2
              },
              767: {
                  slidesPerView: 1
              }
          }
      });
  }
  
  
}
