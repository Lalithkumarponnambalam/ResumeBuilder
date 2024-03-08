import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IKeySkills, KeySkills } from '../key-skills.model';
import { KeySkillsService } from '../service/key-skills.service';

import { KeySkillsRoutingResolveService } from './key-skills-routing-resolve.service';

describe('KeySkills routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: KeySkillsRoutingResolveService;
  let service: KeySkillsService;
  let resultKeySkills: IKeySkills | undefined;

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
    routingResolveService = TestBed.inject(KeySkillsRoutingResolveService);
    service = TestBed.inject(KeySkillsService);
    resultKeySkills = undefined;
  });

  describe('resolve', () => {
    it('should return IKeySkills returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeySkills = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultKeySkills).toEqual({ id: 123 });
    });

    it('should return new IKeySkills if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeySkills = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultKeySkills).toEqual(new KeySkills());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as KeySkills })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultKeySkills = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultKeySkills).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
