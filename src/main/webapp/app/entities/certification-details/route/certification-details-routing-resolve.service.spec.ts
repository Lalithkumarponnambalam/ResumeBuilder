import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICertificationDetails, CertificationDetails } from '../certification-details.model';
import { CertificationDetailsService } from '../service/certification-details.service';

import { CertificationDetailsRoutingResolveService } from './certification-details-routing-resolve.service';

describe('CertificationDetails routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CertificationDetailsRoutingResolveService;
  let service: CertificationDetailsService;
  let resultCertificationDetails: ICertificationDetails | undefined;

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
    routingResolveService = TestBed.inject(CertificationDetailsRoutingResolveService);
    service = TestBed.inject(CertificationDetailsService);
    resultCertificationDetails = undefined;
  });

  describe('resolve', () => {
    it('should return ICertificationDetails returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCertificationDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCertificationDetails).toEqual({ id: 123 });
    });

    it('should return new ICertificationDetails if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCertificationDetails = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCertificationDetails).toEqual(new CertificationDetails());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CertificationDetails })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCertificationDetails = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCertificationDetails).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
