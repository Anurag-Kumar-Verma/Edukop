import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(
        public toastController: ToastController,
        public router: Router
    ) {}

    async showToast(
        message: string,
        slide: 'start' | 'end',
        text?: string,
        handler?: string
    ): Promise<void> {
        // message: "Product added to cart",
        // side: "end",
        // text: "Go To Cart",
        // this.router.navigateByUrl("/cart");
        const toast = await this.toastController.create({
            message,

            duration: 2000,
            buttons: [
                {
                    side: slide,
                    text,
                    handler: () => {
                        this.router.navigateByUrl(handler).catch();
                    },
                },
            ],
        });
        toast.present().catch();
    }
}
