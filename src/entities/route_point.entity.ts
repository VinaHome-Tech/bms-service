
// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Point } from "./point.entity";
// import { Route } from "./route.entity";

// @Entity('tbl_route_point')
// export class RoutePoint {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   route_id: number;

//   @Column()
//   point_id: number;

//   @Column()
//   display_order: number;

//   @Column()
//   time_gap: string;

//   @ManyToOne(() => Route, (route) => route.routePoints, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'route_id', referencedColumnName: 'id' })
//   route: Route;

//   @ManyToOne(() => Point, (point) => point.routePoints, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'point_id', referencedColumnName: 'id' })
//   point: Point;
// }