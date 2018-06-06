import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateDmy'
})
export class FormatDateDmyPipe implements PipeTransform {

  transform(date: any): any {
    let newDate = new Date(date);
    let day = Number(newDate.getDate());
    let finalDate;
    let month = Number(newDate.getMonth()) + 1;
    let finalMonth;

    (month < 10) ? finalMonth = "0" + month : finalMonth = month;
    (day < 10) ? finalDate = "0" + day : finalDate = day;

    let final = finalDate + "/" + finalMonth + "/" + newDate.getFullYear();
    return final;
  }

}
