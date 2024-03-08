import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IPersonalDetails, PersonalDetails } from '../personal-details.model';
import { PersonalDetailsService } from '../service/personal-details.service';

import { PersonalDetailsRoutingResolveService } from './personal-details-routing-resolve.service';

describe('PersonalDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PersonalDetailsRoutingResolveService;
  let service: PersonalDetailsService;
  let resultPersonalDetails: IPersonalDetails | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(PersonalDetailsRoutingResolveService);
    service = TestBed.inject(PersonalDetailsService);
    resultPersonalDetails = undefined;
  });

  describe('resolve', () => {
    it('should return IPersonalDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPersonalDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPersonalDetails).toEqual({ id: 123 });
    });

    it('should return new IPersonalDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPersonalDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPersonalDetails).toEqual(new PersonalDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as PersonalDetails })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPersonalDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPersonalDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
