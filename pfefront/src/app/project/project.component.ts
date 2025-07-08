import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit{

     availableProducts: Product[] | undefined;

    selectedProducts: Product[] | undefined;

    draggedProduct: Product | undefined | null;
  ngOnInit(): void {
     this.selectedProducts = [];
        this.availableProducts = [
            {id:'1', name: 'Black Watch'},
            {id:'2', name: 'Bamboo Watch'}
        ]
  }

  
  dragStart(product: any) {
        this.draggedProduct = product;
    }

       drop() {
        if (this.draggedProduct) {
            let draggedProductIndex = this.findIndex(this.draggedProduct);
            this.selectedProducts = [...(this.selectedProducts as Product[]), this.draggedProduct];
            this.availableProducts = this.availableProducts?.filter((val, i) => i != draggedProductIndex);
            this.draggedProduct = null;
        }
    }


      dragEnd() {
        this.draggedProduct = null;
    }

    findIndex(product: Product) {
        let index = -1;
        for (let i = 0; i < (this.availableProducts as Product[]).length; i++) {
            if (product.id === (this.availableProducts as Product[])[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }
}
export class Product {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}