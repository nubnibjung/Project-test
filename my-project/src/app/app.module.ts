import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BurgerComponent } from './pages/burger/burger.component';
import { BakeryComponent } from './pages/bakery/bakery.component';
import { LearnSkillComponent } from './pages/learn-skill/learn-skill.component';
import { OrderTableComponent } from './pages/order-table/order-table.component';
import { ProductsComponent } from './pages/products/products.component';
import { SetingsComponent } from './pages/setings/setings.component';
import { TaskBoardComponent } from './pages/task-board/task-board.component';
import { TaxiComponent } from './pages/taxi/taxi.component';

import { FormsModule } from '@angular/forms';   
import { MemberComponent } from './pages/member/member.component';

@NgModule({
  declarations: [
    AppComponent,
    BakeryComponent,
    LearnSkillComponent,
    ProductsComponent,
          TaxiComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SetingsComponent,
    TaskBoardComponent,
    OrderTableComponent, 
    BurgerComponent,
    FormsModule,
    MemberComponent
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
