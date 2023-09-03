import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { map } from 'rxjs';
import { formList, totalItamList } from '../models/forms.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  totalItamList: totalItamList = {
    amount: 0,
    discount: 0,
    total: 0,
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      formList: this.fb.array([]),
    });
  }

  get formList(): FormArray {
    return this.form.get('formList') as FormArray;
  }

  ngOnInit(): void {}

  addItems() {
    let isShowItem = false;
    for (let index = 0; index < this.formList.controls.length; index++) {
      let formValue = this.formList.controls[index].value;
      if (
        formValue.name == '' ||
        formValue.qty == null ||
        formValue.amount == null ||
        formValue.discount == null
      ) {
        isShowItem = true;
        let controls: FormGroup = this.formList.controls[index] as FormGroup;
        controls.markAllAsTouched();
      }
    }
    if (isShowItem == false) {
      this.formList.push(this.newformList());
    }
    if (this.formList.controls.length == 0) {
      this.formList.push(this.newformList());
    }
  }

  newformList(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      qty: [null, Validators.required],
      amount: [null, Validators.required],
      discount: [null, Validators.required],
      total: [0, Validators.required],
    });
  }

  removeformItem(i: number) {
    this.formList.removeAt(i);
    this.allTotalList();
  }

  itemChange(type: string, index: number) {
    let list: FormArray = this.form.get('formList') as FormArray;
    if (type == 'name') {
    } else if (type == 'qty') {
      if (list.value[index].qty == null) {
        for (let i = 0; i < list.value.length; i++) {
          if (i > index) {
            console.log('fffff', i);
            this.removeformItem(i);
          }
        }
      } else {
        for (let i = 0; i < Number(list.value[index].qty); i++) {
          // this.addItems();
        }
      }
    } else if (type == 'amount') {
    } else if (type == 'discount') {
    } else if (type == 'total') {
    }
    let total: number | string =
      (list.value[index].qty ? Number(list.value[index].qty) : 1) *
        (list.value[index].amount ? Number(list.value[index].amount) : 0) -
      (list.value[index].discount ? Number(list.value[index].discount) : 0);
    if (total < 0) {
      total = 'value is invalid ' + total;
      list.controls[index].setValue({ ...list.value[index], total });
    } else {
      list.controls[index].setValue({ ...list.value[index], total });
    }
    this.allTotalList();
  }

  allTotalList() {
    let list: FormArray = this.form.get('formList') as FormArray;
    let item: totalItamList = {
      amount: 0,
      discount: 0,
      total: 0,
    };
    list.value.forEach((element: totalItamList) => {
      item.amount = Number(item.amount) + Number(element.amount);
      item.discount = item.discount + Number(element.discount);
      item.total = item.total + Number(element.total);
    });
    this.totalItamList = item;
  }

  isInvalid(item: AbstractControl, name: string) {
    return item.get(name)?.invalid;
  }
  isDirty(item: AbstractControl, name: string) {
    return item.get(name)?.dirty;
  }
  isTouched(item: AbstractControl, name: string) {
    return item.get(name)?.touched;
  }

  changeValue(type: string, index: number) {
    if (type == 'name') {
      if (this.formList.controls[index].value.name.trim() == '') {
        let name = null;
        this.formList.controls[index].setValue({
          ...this.formList.value[index],
          name,
        });
      }
    }
  }
}
